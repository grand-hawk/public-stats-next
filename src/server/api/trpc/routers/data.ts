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
  unique: {
    vehicles: string[];
    versions: number[];
  };
}

for (const placeId of Object.values(places)) {
  const kdr = JSON.parse(
    await fs.readFile(`./data/${placeId}/kdr.json`, 'utf-8'),
  );
  const uniqueVehicles = JSON.parse(
    await fs.readFile(`./data/${placeId}/vehicles.json`, 'utf-8'),
  );
  const uniqueVersions = JSON.parse(
    await fs.readFile(`./data/${placeId}/versions.json`, 'utf-8'),
  );

  placeData.set(placeId, {
    kdr,
    unique: {
      vehicles: uniqueVehicles,
      versions: uniqueVersions,
    },
  });
}

export const dataRouter = createTRPCRouter({
  places: publicProcedure.query(async () => {
    return places;
  }),

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

  unique: publicProcedure
    .input(
      z.object({
        placeId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.placeId || !placeData.has(input.placeId)) return null;
      const data = placeData.get(input.placeId)!;
      return data.unique;
    }),
});
