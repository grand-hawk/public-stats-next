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
import { getVehicleImage } from '@/utils/getVehicleImage';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getKdr } from '@generated/kdr';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';
import { getVehiclesLd } from '@generated/vehicles_ld';

import type {
  VehicleContent,
  VehicleMeta,
} from '@/server/utils/vehicleContent';
import type { PlaceId } from '@generated/config';
import type { KdrPlaceDataVehicle } from '@generated/kdr';
import type { LoadoutsPlaceDataLoadoutVehicle } from '@generated/loadouts';
import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';
import type { BreadcrumbList, Vehicle, WithContext } from 'schema-dts';

export interface ListVehicle {
  name: string;
  slug: string;
  team: string;
  role: string;
  new?: boolean;
}

export type VehicleAvailability = Record<
  string,
  LoadoutsPlaceDataLoadoutVehicle
>;

export type DetailedVehicle = VehiclesPlaceDataVehicle & {
  info: {
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
        .map(
          ([name, data]) =>
            ({
              name,
              slug: data.info.slug,
              team: data.info.team,
              role: data.info.role,
              new: data.info.addedDate
                ? dateNow - new Date(data.info.addedDate).getTime() <
                  1_000 * 60 * 60 * 24 * 31
                : undefined,
            }) satisfies ListVehicle,
        )
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
      const vehiclesLd = getVehiclesLd();
      const { data: config } = getConfig();

      const vehiclesPlace = vehicles.data[input.placeId as PlaceId];
      if (!vehiclesPlace) throw new TRPCError({ code: 'NOT_FOUND' });

      const vehicleName = vehiclesPlace.metadata.slugs[input.slug];
      if (!vehicleName) return null;

      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      const kdrPlace = kdr.data[input.placeId as PlaceId];
      const linkedData = vehiclesLd.data[
        input.placeId as PlaceId
      ] as unknown as Record<string, WithContext<Vehicle>>;

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

      const namedVehicle: DetailedVehicle = {
        ...vehicle,
        info: {
          ...vehicle.info,
          name: vehicleName,
          lastRetrieved: vehicles.metadata.date,
          availability,
          kdr: kdrPlace.data.all_time[vehicleName],
        },
        content: getVehicleContent(slug(vehicle.info.gameId)) || undefined,
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
          vehicle: {
            ...linkedData[vehicleName],
            url: new URL(
              `${initials}/vehicles/${input.slug}`,
              baseUrl,
            ).toString(),
            image: getVehicleImage(input.slug),
          },
        },
      };

      return namedVehicle;
    }),

  armorMeta: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }): VehicleMeta => {
      const contentSlug = resolveContentSlug(input.slug);
      return contentSlug ? (getVehicleMeta(contentSlug) ?? {}) : {};
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
