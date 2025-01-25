import fs from 'node:fs/promises';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import places_json from '@config/places.json';

const places = places_json as Record<string, number>;
const placeData = new Map<number, PlaceData>();

export interface PlaceData {
  kdr: Array<{
    name: string;
    kd: number;
    kills: number;
    deaths: number;
  }>;
  metadata: {
    date: string;
    vehicles: string[];
    versions: number[];
  };
}

for (const placeId of Object.values(places)) {
  const kdr = JSON.parse(
    await fs.readFile(`./data/kdr/${placeId}/kdr.json`, 'utf-8'),
  );
  const metadata = JSON.parse(
    await fs.readFile(`./data/kdr/${placeId}/metadata.json`, 'utf-8'),
  );

  placeData.set(placeId, {
    kdr,
    metadata,
  });
}

export const kdrRouter = createTRPCRouter({
  kdr: publicProcedure
    .input(
      z.object({
        placeId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.placeId || !placeData.has(input.placeId)) return null;

      const data = placeData.get(input.placeId)!;

      return data.kdr;
    }),

  metadata: publicProcedure
    .input(
      z.object({
        placeId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.placeId || !placeData.has(input.placeId)) return null;

      const data = placeData.get(input.placeId)!;

      return data.metadata;
    }),
});
