import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import vehicles from '@generated/vehicles';

import type { PlaceId } from '@generated/config';
import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';

export interface ListVehicle {
  name: string;
  slug: string;
  team: string;
  role: string;
}

export type NamedVehicle = VehiclesPlaceDataVehicle & {
  info: {
    name: string;
  };
};

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
      const namedVehicle: NamedVehicle = {
        ...vehicle,
        info: {
          ...vehicle.info,
          name: vehicleName,
        },
      };

      return namedVehicle;
    }),
});
