import { existsSync } from 'node:fs';

import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import vehicles from '@generated/vehicles';
import vehicles_ld from '@generated/vehicles_ld';

import type { PlaceId } from '@generated/config';
import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';
import type { Vehicle, WithContext } from 'schema-dts';

export interface ListVehicle {
  name: string;
  slug: string;
  team: string;
  role: string;
}

export type DetailedVehicle = VehiclesPlaceDataVehicle & {
  info: {
    name: string;
    image: string | null;
  };
};

const imageCache = new Map<string, string | null>();

export const vehiclesRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }) => {
      const data = vehicles.data[input.placeId as PlaceId]?.data;
      if (!data) return [];

      return Object.entries(data)
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
      const place = vehicles.data[input.placeId as PlaceId];
      if (!place) return null;

      const vehicleName = place.metadata.slugs[input.slug];
      if (!vehicleName) return null;

      const vehicle = place.data[vehicleName];

      let cachedImage = imageCache.get(vehicle.info.slug);
      if (cachedImage === undefined) {
        const imageUrl = `/assets/vehicles/${vehicle.info.slug}.png`;
        const imageResult =
          !imageUrl.startsWith('/') || existsSync(`./public${imageUrl}`)
            ? imageUrl
            : null;

        imageCache.set(vehicle.info.slug, imageResult);
        cachedImage = imageResult;
      }

      const namedVehicle: DetailedVehicle = {
        ...vehicle,
        info: {
          ...vehicle.info,
          name: vehicleName,
          image: cachedImage,
        },
      };

      return namedVehicle;
    }),

  linkedDataBySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }) => {
      const vehiclesMetadata =
        vehicles.data[input.placeId as PlaceId]?.metadata;
      if (!vehiclesMetadata) return null;

      const vehicleName = vehiclesMetadata.slugs[input.slug];
      if (!vehicleName) return null;

      const linkedData = vehicles_ld.data[input.placeId as PlaceId];
      if (!linkedData) return null;

      return (
        (linkedData[vehicleName] as unknown as WithContext<Vehicle>) || null
      );
    }),
});
