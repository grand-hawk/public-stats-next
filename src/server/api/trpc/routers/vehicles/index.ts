import fs from 'node:fs';
import path from 'node:path';

import { TRPCError } from '@trpc/server';
import slug from 'slug';
import z from 'zod';

import { SPEED_TEST } from '@/components/features/vehicles/browse/speedBands';
import { IS_DEV } from '@/env';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import {
  getVehicleContent,
  getVehicleMeta,
} from '@/server/utils/vehicleContent';
import { simplifyString } from '@/utils/simplifyString';
import { getBaseUrl } from '@/utils/trpc';
import {
  classificationOrder,
  getClassification,
} from '@/utils/vehicleClassification';
import { getConfig } from '@generated/config';
import { getKdr } from '@generated/kdr';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { VehicleContent } from '@/server/utils/vehicleContent';
import type { PlaceId } from '@generated/config';
import type { KdrPlaceDataVehicle } from '@generated/kdr';
import type { LoadoutsPlaceDataLoadoutVehicle } from '@generated/loadouts';
import type {
  VehiclesPlaceDataVehicle,
  VehiclesPlaceDataVehicleInfo,
  VehiclesPlaceDataVehicleModule,
} from '@generated/vehicles';
import type { BreadcrumbList, Vehicle, WithContext } from 'schema-dts';

type Mod<T extends VehiclesPlaceDataVehicleModule['type']> = Extract<
  VehiclesPlaceDataVehicleModule,
  { type: T }
>;

type ListVehicleFieldsFromInfo = Pick<
  VehiclesPlaceDataVehicleInfo,
  'amphibious' | 'locomotion' | 'role' | 'slug' | 'supportedClasses' | 'team'
>;

type VehiclePremiumType = NonNullable<
  VehiclesPlaceDataVehicleInfo['premium']
>['type'];

export interface ListVehicle extends ListVehicleFieldsFromInfo {
  addedDate?: string;
  classification: string;
  forwardSpeed: number;
  frontArmorDepth?: number;
  hasAPS: boolean;
  hasESS: boolean;
  hasJammer: boolean;
  hasStabilizer: boolean;
  hasThermal: boolean;
  name: string;
  new?: boolean;
  premium?: VehiclePremiumType;
  seatCount: number;
}

export interface SearchedVehicle {
  name: string;
  new?: boolean;
  role: string;
  slug: string;
  team: string;
}

export interface VehicleSearchFacets {
  classifications: [string, number][];
  crewClasses: string[];
  obtainments: [string, number][];
}

export type VehicleAvailability = Record<
  string,
  LoadoutsPlaceDataLoadoutVehicle
>;

export type DetailedVehicle = VehiclesPlaceDataVehicle & {
  info: {
    frontArmorDepth?: number;
    name: string;
    lastRetrieved: string;
    availability: VehicleAvailability;
    kdr: KdrPlaceDataVehicle;
  };
  content?: VehicleContent;
  linkedData: Partial<{
    breadcrumbs: WithContext<BreadcrumbList>;
    vehicle: WithContext<Vehicle>;
  }>;
};

interface SearchEntry {
  amphibious: boolean;
  classification: string;
  forwardSpeed: number;
  hasAPS: boolean;
  hasESS: boolean;
  hasJammer: boolean;
  hasStabilizer: boolean;
  hasThermal: boolean;
  obtainment: string;
  simplifiedName: string;
  supportedClasses: string[];
  vehicle: SearchedVehicle;
}

const searchIndexCache = new Map<PlaceId, SearchEntry[]>();

function buildSearchIndex(placeId: PlaceId): SearchEntry[] {
  const cached = searchIndexCache.get(placeId);
  if (cached) return cached;

  const vehicles = getVehicles();
  const vehiclesData = vehicles.data[placeId]?.data;
  if (!vehiclesData) throw new TRPCError({ code: 'NOT_FOUND' });

  const dateNow = Date.now();
  const thirtyOneDays = 1_000 * 60 * 60 * 24 * 31;

  const entries: SearchEntry[] = Object.entries(vehiclesData)
    .filter(([, data]) => !data.info.unlisted)
    .map(([name, data]) => {
      const mods = Object.values(data.modules);
      const turrets = mods
        .filter((m): m is Mod<'Turret'> => m.type === 'Turret')
        .map((m) => m.data);
      const driveDatas = mods
        .filter((m): m is Mod<'DriveData'> => m.type === 'DriveData')
        .map((m) => m.data);

      const isNew = data.info.addedDate
        ? dateNow - new Date(data.info.addedDate).getTime() < thirtyOneDays
        : false;

      return {
        amphibious: data.info.amphibious,
        classification: getClassification(data.info.role),
        forwardSpeed:
          driveDatas.length > 0
            ? Math.max(...driveDatas.map((d) => d.engine.forwardSpeed))
            : 0,
        hasAPS: mods.some((m) => m.type === 'APS'),
        hasESS: mods
          .filter((m): m is Mod<'ESS'> => m.type === 'ESS')
          .some((m) => m.data.present),
        hasJammer: mods
          .filter((m): m is Mod<'EW'> => m.type === 'EW')
          .some((m) => m.data.ied || m.data.drone),
        hasStabilizer: turrets.some((t) => t.stabilizer),
        hasThermal: turrets.some((t) => t.sights.some((s) => !!s.thermal)),
        obtainment: data.info.premium?.type ?? 'free',
        simplifiedName: simplifyString(name),
        supportedClasses: data.info.supportedClasses,
        vehicle: {
          name,
          new: isNew || undefined,
          role: data.info.role,
          slug: data.info.slug,
          team: data.info.team,
        },
      };
    })
    .sort((a, b) => a.vehicle.name.localeCompare(b.vehicle.name));

  searchIndexCache.set(placeId, entries);
  return entries;
}

function matchesAnyBand(
  testByKey: Map<string, (v: number) => boolean>,
  selected: Set<string>,
  value: number,
): boolean {
  if (selected.size === 0) return true;
  for (const key of selected) {
    if (testByKey.get(key)?.(value)) return true;
  }
  return false;
}

function resolveContentSlug(vehicleSlug: string): string | null {
  const vehicles = getVehicles();
  for (const place of Object.values(vehicles.data)) {
    const vehicleName = place.metadata.slugs[vehicleSlug];
    if (vehicleName) {
      return slug(place.data[vehicleName].info.gameId);
    }
  }
  return null;
}

export const vehiclesRouter = createTRPCRouter({
  searchFacets: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }): VehicleSearchFacets => {
      const entries = buildSearchIndex(input.placeId as PlaceId);

      const classMap = new Map<string, number>();
      const obtMap = new Map<string, number>();
      const classSet = new Set<string>();

      for (const entry of entries) {
        classMap.set(
          entry.classification,
          (classMap.get(entry.classification) ?? 0) + 1,
        );
        obtMap.set(
          entry.obtainment,
          (obtMap.get(entry.obtainment) ?? 0) + 1,
        );
        for (const supportedClass of entry.supportedClasses) {
          classSet.add(supportedClass);
        }
      }

      return {
        classifications: classificationOrder
          .filter(
            (classification) =>
              classification !== 'Other' && classMap.has(classification),
          )
          .map(
            (classification) =>
              [classification, classMap.get(classification)!] as [
                string,
                number,
              ],
          ),
        crewClasses: [...classSet].sort(),
        obtainments: [...obtMap.entries()].sort((a, b) =>
          a[0].localeCompare(b[0]),
        ),
      };
    }),

  search: publicProcedure
    .input(
      z.object({
        amphibious: z.boolean().default(false),
        aps: z.boolean().default(false),
        classifications: z.array(z.string()).default([]),
        crewClasses: z.array(z.string()).default([]),
        ess: z.boolean().default(false),
        jammer: z.boolean().default(false),
        obtainments: z.array(z.string()).default([]),
        placeId: z.string(),
        query: z.string().default(''),
        speedBands: z.array(z.string()).default([]),
        stabilizer: z.boolean().default(false),
        thermal: z.boolean().default(false),
      }),
    )
    .query(({ input }): SearchedVehicle[] => {
      const entries = buildSearchIndex(input.placeId as PlaceId);

      const classifications = new Set(input.classifications);
      const speedBands = new Set(input.speedBands);
      const obtainments = new Set(input.obtainments);
      const crewClasses = new Set(input.crewClasses);
      const normalizedQuery = input.query
        ? simplifyString(input.query)
        : null;

      const result: SearchedVehicle[] = [];

      for (const entry of entries) {
        if (
          classifications.size > 0 &&
          !classifications.has(entry.classification)
        ) {
          continue;
        }
        if (!matchesAnyBand(SPEED_TEST, speedBands, entry.forwardSpeed)) {
          continue;
        }
        if (
          obtainments.size > 0 &&
          !obtainments.has(entry.obtainment)
        ) {
          continue;
        }
        if (
          crewClasses.size > 0 &&
          !entry.supportedClasses.some((supportedClass) =>
            crewClasses.has(supportedClass),
          )
        ) {
          continue;
        }
        if (input.aps && !entry.hasAPS) continue;
        if (input.amphibious && !entry.amphibious) continue;
        if (input.ess && !entry.hasESS) continue;
        if (input.jammer && !entry.hasJammer) continue;
        if (input.stabilizer && !entry.hasStabilizer) continue;
        if (input.thermal && !entry.hasThermal) continue;
        if (
          normalizedQuery &&
          !entry.simplifiedName.includes(normalizedQuery)
        ) {
          continue;
        }

        result.push(entry.vehicle);
      }

      return result;
    }),

  list: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }): ListVehicle[] => {
      const vehicles = getVehicles();

      const vehiclesData = vehicles.data[input.placeId as PlaceId]?.data;
      if (!vehiclesData) throw new TRPCError({ code: 'NOT_FOUND' });

      const dateNow = Date.now();

      return Object.entries(vehiclesData)
        .filter(([, data]) => !data.info.unlisted)
        .map(([name, data]) => {
          const mods = Object.values(data.modules);
          const turrets = mods
            .filter((m): m is Mod<'Turret'> => m.type === 'Turret')
            .map((m) => m.data);
          const driveDatas = mods
            .filter((m): m is Mod<'DriveData'> => m.type === 'DriveData')
            .map((m) => m.data);

          const seats = mods.filter((m): m is Mod<'Seat'> => m.type === 'Seat');

          return {
            addedDate: data.info.addedDate,
            amphibious: data.info.amphibious,
            classification: getClassification(data.info.role),
            forwardSpeed:
              driveDatas.length > 0
                ? Math.max(...driveDatas.map((d) => d.engine.forwardSpeed))
                : 0,
            hasAPS: mods.some((m) => m.type === 'APS'),
            hasESS: mods
              .filter((m): m is Mod<'ESS'> => m.type === 'ESS')
              .some((m) => m.data.present),
            hasJammer: mods
              .filter((m): m is Mod<'EW'> => m.type === 'EW')
              .some((m) => m.data.ied || m.data.drone),
            hasStabilizer: turrets.some((t) => t.stabilizer),
            hasThermal: turrets.some((t) => t.sights.some((s) => !!s.thermal)),
            locomotion: data.info.locomotion,
            name,
            new: data.info.addedDate
              ? dateNow - new Date(data.info.addedDate).getTime() <
                1_000 * 60 * 60 * 24 * 31
              : undefined,
            premium: data.info.premium?.type,
            role: data.info.role,
            seatCount: seats.length,
            slug: data.info.slug,
            supportedClasses: data.info.supportedClasses,
            team: data.info.team,
            ...(IS_DEV
              ? {
                  frontArmorDepth: getVehicleMeta(slug(data.info.gameId))
                    ?.frontArmorDepth,
                }
              : {}),
          } satisfies ListVehicle;
        })
        .sort((a, b) => a.name.localeCompare(b.name)) as ListVehicle[];
    }),

  bySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }): DetailedVehicle | null => {
      const vehicles = getVehicles();
      const loadouts = getLoadouts();
      const kdr = getKdr();
      const { data: config } = getConfig();

      const vehiclesPlace = vehicles.data[input.placeId as PlaceId];
      if (!vehiclesPlace) throw new TRPCError({ code: 'NOT_FOUND' });

      const vehicleName = vehiclesPlace.metadata.slugs[input.slug];
      if (!vehicleName) return null;

      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      const kdrPlace = kdr.data[input.placeId as PlaceId];

      const vehicle = vehiclesPlace.data[vehicleName];
      const initials =
        config.placeNameInitials[vehiclesPlace.metadata.placeName];
      const baseUrl = getBaseUrl();

      const availability: VehicleAvailability = {};
      for (const [loadoutName, loadout] of Object.entries(loadoutsPlace.data)) {
        if (vehicleName in loadout.vehicles) {
          availability[loadoutName] = loadout.vehicles[vehicleName];
        }
      }

      const contentSlug = slug(vehicle.info.gameId);
      const namedVehicle: DetailedVehicle = {
        ...vehicle,
        info: {
          ...vehicle.info,
          frontArmorDepth: getVehicleMeta(contentSlug)?.frontArmorDepth,
          name: vehicleName,
          lastRetrieved: vehicles.metadata.date,
          availability,
          kdr: kdrPlace.data.all_time[vehicleName],
        },
        content: getVehicleContent(contentSlug) || undefined,
        linkedData: {
          breadcrumbs: {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Vehicles',
                item: new URL(`${initials}/vehicles`, baseUrl).toString(),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: vehicleName,
              },
            ],
          },
        },
      };

      return namedVehicle;
    }),

  setFrontArmorDepth: publicProcedure
    .input(z.object({ slug: z.string(), value: z.number().min(0).max(100) }))
    .mutation(({ input }): void => {
      if (!IS_DEV) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const contentSlug = resolveContentSlug(input.slug);
      if (!contentSlug) throw new TRPCError({ code: 'NOT_FOUND' });

      const filepath = path.join('content/vehicles', `${contentSlug}.md`);
      if (!fs.existsSync(filepath)) throw new TRPCError({ code: 'NOT_FOUND' });

      const raw = fs.readFileSync(filepath, 'utf-8');
      const fmEnd = raw.startsWith('---\n') ? raw.indexOf('\n---\n', 4) : -1;
      const body = fmEnd !== -1 ? raw.slice(fmEnd + 5) : raw;
      fs.writeFileSync(
        filepath,
        `---\nfrontArmorDepth: ${Math.round(input.value)}\n---\n\n${body.trimStart()}`,
        'utf-8',
      );
    }),
});
