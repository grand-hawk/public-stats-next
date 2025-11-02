import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import kdr from '@generated/kdr';
import vehicles from '@generated/vehicles';

import type { PlaceId } from '@generated/config';
import type { KdrPlaceDataItem } from '@generated/kdr';

export interface DetailedKdrItem extends KdrPlaceDataItem {
  vehicle: string;
  team: string;
}

export const kdrRouter = createTRPCRouter({
  table: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }) => {
      const kdrData = kdr.data[input.placeId as PlaceId]?.data;
      if (!kdrData) return []; // This validates placeId

      const vehiclesData = vehicles.data[input.placeId as PlaceId]?.data;

      return Object.entries(kdrData)
        .map(([vehicle, data]) => {
          if (!vehiclesData[vehicle]) return null;

          return {
            vehicle,
            team: vehiclesData[vehicle].info.team,
            ...data,
          };
        })
        .filter((item): item is DetailedKdrItem => item !== null);
    }),
});
