import fs from 'node:fs';
import path from 'node:path';

import { TRPCError } from '@trpc/server';
import slug from 'slug';
import z from 'zod';

import { IS_DEV } from '@/env';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import {
  getVehicleContent,
  getVehicleMeta,
} from '@/server/utils/vehicleContent';
import { getBaseUrl } from '@/utils/trpc';
import { getClassification } from '@/utils/vehicleClassification';
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
  classification: string;
  forwardSpeed: number;
  frontArmorDepth?: number;
  hasAPS: boolean;
  hasESS: boolean;
  hasStabilizer: boolean;
  hasThermal: boolean;
  name: string;
  new?: boolean;
  premium?: VehiclePremiumType;
  seatCount: number;
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
  list: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }) => {
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
    .query(({ input }) => {
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
    .mutation(({ input }) => {
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
