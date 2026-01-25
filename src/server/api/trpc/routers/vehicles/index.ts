import { existsSync } from 'node:fs';

import z from 'zod';

import { MEDIA_PREFIX } from '@/env';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getKdr } from '@generated/kdr';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';
import { getVehiclesLd } from '@generated/vehicles_ld';

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
}

export type VehicleAvailability = Record<
  string,
  LoadoutsPlaceDataLoadoutVehicle
>;

export type DetailedVehicle = VehiclesPlaceDataVehicle & {
  info: {
    name: string;
    image: string | null;
    lastRetrieved: string;
    availability: VehicleAvailability;
    kdr: KdrPlaceDataVehicle;
  };
  linkedData: Partial<{
    breadcrumbs: WithContext<BreadcrumbList>;
    vehicle: WithContext<Vehicle>;
  }>;
};

const imageCache = new Map<string, string | null>();

export function getVehicleImage(slug: string) {
  let cachedImage = imageCache.get(slug);
  if (cachedImage === undefined) {
    const imageUrl = `${MEDIA_PREFIX}/assets/vehicles/${slug}.png`;
    const imageResult =
      !imageUrl.startsWith('/') || existsSync(`./public${imageUrl}`)
        ? imageUrl
        : null;

    imageCache.set(slug, imageResult);
    cachedImage = imageResult;
  }

  return cachedImage;
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
      if (!vehiclesData) return []; // This validates placeId

      return Object.entries(vehiclesData)
        .map(([name, data]) => ({
          name,
          slug: data.info.slug,
          team: data.info.team,
          role: data.info.role,
        }))
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
      if (!vehiclesPlace) return null; // This validates placeId

      const vehicleName = vehiclesPlace.metadata.slugs[input.slug];
      if (!vehicleName) return null; // This validates slug

      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      const kdrPlace = kdr.data[input.placeId as PlaceId];
      const linkedData = vehiclesLd.data[
        input.placeId as PlaceId
      ] as unknown as Record<string, WithContext<Vehicle>>;

      const vehicle = vehiclesPlace.data[vehicleName];
      const initials =
        config.placeNameInitials[vehiclesPlace.metadata.placeName];
      const relativeImageUrl = getVehicleImage(input.slug);
      const baseUrl = getBaseUrl();
      const publicImageUrl =
        relativeImageUrl?.startsWith('/') &&
        new URL(relativeImageUrl, baseUrl).toString();

      const availability: VehicleAvailability = {};
      for (const [loadoutName, loadout] of Object.entries(loadoutsPlace.data)) {
        if (vehicleName in loadout.vehicles)
          availability[loadoutName] = loadout.vehicles[vehicleName];
      }

      const namedVehicle: DetailedVehicle = {
        ...vehicle,
        info: {
          ...vehicle.info,
          name: vehicleName,
          image: relativeImageUrl,
          lastRetrieved: vehicles.metadata.date,
          availability,
          kdr: kdrPlace.data.all_time[vehicleName],
        },
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
            image: publicImageUrl || undefined,
          },
        },
      };

      return namedVehicle;
    }),
});
