import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import kdr from '@generated/kdr';
import vehicles from '@generated/vehicles';

import type { PlaceId } from '@generated/config';
import type {
  KdrPlaceData,
  KdrPlaceDataVehicle,
  KdrPlaceRangeData,
} from '@generated/kdr';

export interface DetailedKdrItem extends KdrPlaceDataVehicle {
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
      if (!kdrData) return { all_time: [], recent: [] }; // This validates placeId

      const vehiclesData = vehicles.data[input.placeId as PlaceId]?.data;

      return Object.fromEntries(
        (
          Object.entries(kdrData) as Array<
            [keyof KdrPlaceData, KdrPlaceRangeData]
          >
        ).map(([range, kdr]) => {
          return [
            range,
            Object.entries(kdr)
              .map(([vehicle, data]) => {
                if (!vehiclesData[vehicle]) return null;

                return {
                  vehicle,
                  team: vehiclesData[vehicle].info.team,
                  ...data,
                } as DetailedKdrItem;
              })
              .filter((item): item is DetailedKdrItem => item !== null),
          ];
        }),
      ) as Record<keyof KdrPlaceData, DetailedKdrItem[]>;
    }),
});
