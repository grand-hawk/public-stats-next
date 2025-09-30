import { TRPCError } from '@trpc/server';
import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getPreferredVehicleClasses } from '@/server/lib/getPreferredVehicleClasses';
import { getVehicleClasses } from '@/server/lib/getVehicleClasses';
import { getPlaceNameFromInitials } from '@/utils/getPlaceNameFromInitials';
import config from '@generated/config';
import loadouts from '@generated/loadouts';

export const contentRouter = createTRPCRouter({
  sidebar: publicProcedure
    .input(
      z.object({
        place: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const placeName = getPlaceNameFromInitials(input.place);
      const placeId = placeName && config.data.placeIds[placeName];
      if (!placeId) throw new TRPCError({ code: 'NOT_FOUND' });

      const { metadata: loadoutsMetadata } = loadouts.data[placeId];

      return {
        vehicleClasses: getVehicleClasses(placeId),
        loadouts: loadoutsMetadata.loadouts,
        teams: loadoutsMetadata.teams,
      };
    }),

  pageRoot: publicProcedure
    .input(
      z.object({
        place: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const placeName = getPlaceNameFromInitials(input.place);
      const placeId = placeName && config.data.placeIds[placeName];
      if (!placeId) throw new TRPCError({ code: 'NOT_FOUND' });

      const preferredClasses = getPreferredVehicleClasses(placeId);
      const { metadata: loadoutsMetadata } = loadouts.data[placeId];

      return {
        vehicleClasses: preferredClasses,
        loadouts: loadoutsMetadata.loadouts.slice(0, 3).sort(),
      };
    }),
});
