import { TRPCError } from '@trpc/server';
import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getWinrate } from '@generated/winrate';

import type { PlaceId } from '@generated/config';

export const winrateRouter = createTRPCRouter({
  metadata: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }) => {
      const winrate = getWinrate();

      const winrateMetadata = winrate.data[input.placeId as PlaceId]?.metadata;
      if (!winrateMetadata) throw new TRPCError({ code: 'NOT_FOUND' });

      return {
        loadout: winrateMetadata.loadout,
        map: winrateMetadata.map,
      };
    }),

  chart: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        loadout: z.string(),
        map: z.string(),
      }),
    )
    .query(({ input }) => {
      const winrate = getWinrate();

      const winrateData = winrate.data[input.placeId as PlaceId]?.data;
      if (!winrateData) throw new TRPCError({ code: 'NOT_FOUND' });

      return winrateData[input.loadout]?.[input.map] || null;
    }),
});
