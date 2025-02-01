import fs from 'node:fs/promises';

import Fuse from 'fuse.js';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { safeStat } from '@/server/utils/safeStat';
import places_json from '@config/places.json';

const places = places_json as Record<string, number>;
const placeData = new Map<number, PlaceData>();

export interface Shell {
  name: string;
  type: string;
  mass: number;
  velocity: number;
  damage: number;
  shrapMultiplier: number | undefined;
  ricochetAngle: number | undefined;
  eraTip: number | undefined;

  maxPenetration: number;
  penetrationTable: {
    [angle: number]: {
      [distance: number]: Array<number | undefined>;
    };
  };

  explosive:
    | {
        mass: number;
        blastRadiusMultiplier?: number;
      }
    | undefined;

  missile:
    | {
        boostTime?: number;
        turnRate?: number;
        limit?: number;
        irccm?: boolean;
        unjammable: boolean;
      }
    | undefined;

  cluster:
    | {
        submunitions: number;
        dispersion: number;
      }
    | undefined;
}

export interface PlaceData {
  weapons: Record<string, Shell[]>;
  fuse: Fuse<Shell & { weaponName: string }>;
}

for (const placeId of Object.values(places)) {
  const exists = !!(await safeStat(`./data/shells/${placeId}.json`));
  if (!exists) continue;

  const weapons: PlaceData['weapons'] = JSON.parse(
    await fs.readFile(`./data/shells/${placeId}.json`, 'utf8'),
  );

  const fuse = new Fuse(
    Object.entries(weapons).flatMap(([weapon, shells]) => {
      return shells.map((shell) => ({
        ...shell,
        weaponName: weapon,
      }));
    }),
    {
      keys: ['weaponName', 'name', 'type'],
      threshold: 0.2,
      useExtendedSearch: true,
    },
  );

  placeData.set(placeId, { weapons, fuse });
}

export const shellRouter = createTRPCRouter({
  data: publicProcedure
    .input(
      z.object({
        placeId: z.number(),
        weapon: z.string(),
        shell: z.string(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.placeId || !placeData.has(input.placeId)) return null;

      const { weapons } = placeData.get(input.placeId)!;

      return (
        weapons[input.weapon]?.find((shell) => shell.name === input.shell) ??
        null
      );
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
        weaponName: result.item.weaponName,
        shell: result.item.name,
        type: result.item.type,
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
        size: Object.keys(data.weapons).length,
      };
    }),
});
