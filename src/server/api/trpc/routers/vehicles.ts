import fs from 'node:fs/promises';

import Fuse from 'fuse.js';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { safeStat } from '@/server/utils/safeStat';
import places_json from '@config/places.json';

const places = places_json as Record<string, number>;
const placeData = new Map<number, PlaceData>();

export interface Vehicle {
  name: string;
  mass: number;

  engine: {
    name: string;
    type: string;
    horsepower: number;
    maxRPM: number;
    forwardSpeed: number;
    reverseSpeed: number;

    transmission: {
      neutralSteering: boolean;
      forwardGears: number;
      reverseGears: number;
    };
  };
}

export interface PlaceData {
  vehicles: Vehicle[];
  fuse: Fuse<Vehicle & { engineName: string }>;
}

for (const placeId of Object.values(places)) {
  const exists = !!(await safeStat(`./data/vehicles/${placeId}.json`));
  if (!exists) continue;

  const vehicles: PlaceData['vehicles'] = JSON.parse(
    await fs.readFile(`./data/vehicles/${placeId}.json`, 'utf8'),
  );

  const entries = vehicles.map((vehicle) => ({
    ...vehicle,
    engineName: vehicle.engine.name,
  }));

  const fuseKeys = ['name', 'engineName'];
  const fuseIndex = Fuse.createIndex(fuseKeys, entries);

  const fuse = new Fuse(
    entries,
    {
      keys: fuseKeys,
      threshold: 0.2,
      useExtendedSearch: true,
    },
    Fuse.parseIndex(fuseIndex.toJSON()),
  );

  placeData.set(placeId, { vehicles, fuse });
}

export const vehicleRouter = createTRPCRouter({
  data: publicProcedure
    .input(
      z.object({
        placeId: z.number(),
        vehicle: z.string(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.placeId || !placeData.has(input.placeId)) return null;

      const { vehicles } = placeData.get(input.placeId)!;

      return vehicles.find((vehicle) => vehicle.name === input.vehicle) ?? null;
    }),

  search: publicProcedure
    .input(
      z.object({
        placeId: z.number().optional(),
        query: z.string(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.placeId || !placeData.has(input.placeId)) return null;

      const { fuse } = placeData.get(input.placeId)!;

      const results = fuse.search(input.query);

      return results.map((result) => ({
        name: result.item.name,
      }));
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

      return {
        size: Object.keys(data.vehicles).length,
      };
    }),
});
