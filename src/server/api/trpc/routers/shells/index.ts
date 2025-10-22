import slug from 'slug';
import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import shells from '@generated/shells';

import type { PlaceId } from '@generated/config';

export const shellsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }) => {
      const shellsData = shells.data[input.placeId as PlaceId]?.data;
      if (!shellsData) return []; // This validates placeId

      return Object.fromEntries(
        Object.entries(shellsData).map(([weapon, shells]) => {
          const weaponSlug = slug(weapon);

          return [
            weapon,
            shells.map((shell) => ({
              name: shell.name,
              slug: `${weaponSlug}-${slug(shell.name)}`,
            })),
          ];
        }),
      );
    }),
});
