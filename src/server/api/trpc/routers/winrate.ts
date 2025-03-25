import fs from 'node:fs/promises';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { safeStat } from '@/server/utils/safeStat';
import places_json from '@config/places.json';

const places = places_json as Record<string, number>;
const placeData = new Map<number, PlaceData>();

export interface PlaceData {
  winrate: Record<
    string,
    Array<{
      name: string;
      data: Array<[number, number]>;
      matches: Array<[number, number]>;
    }>
  >;
  metadata: {
    date: string;
    loadouts: string[];
    maps: string[];
  };
}

for (const placeId of Object.values(places)) {
  const metadataExists = !!(await safeStat(
    `./data/winrate/${placeId}/metadata.json`,
  ));
  if (!metadataExists) continue;

  const metadata = JSON.parse(
    await fs.readFile(`./data/winrate/${placeId}/metadata.json`, 'utf-8'),
  ) as PlaceData['metadata'];

  const data: PlaceData = {
    winrate: {},
    metadata,
  };

  const winrate = JSON.parse(
    await fs.readFile(`./data/winrate/${placeId}/winrate.json`, 'utf-8'),
  );
  data.winrate[''] = winrate;

  for (const map of metadata.maps) {
    const mapWinrate = JSON.parse(
      await fs.readFile(
        `./data/winrate/${placeId}/winrate--${map}.json`,
        'utf-8',
      ),
    );
    data.winrate[`-${map}`] = mapWinrate;
  }

  for (const loadout of metadata.loadouts) {
    const loadoutWinrate = JSON.parse(
      await fs.readFile(
        `./data/winrate/${placeId}/winrate-${loadout}.json`,
        'utf-8',
      ),
    );
    data.winrate[loadout] = loadoutWinrate;

    for (const map of metadata.maps) {
      const combinedWinrate = JSON.parse(
        await fs.readFile(
          `./data/winrate/${placeId}/winrate-${loadout}-${map}.json`,
          'utf-8',
        ),
      );
      data.winrate[`${loadout}-${map}`] = combinedWinrate;
    }
  }

  placeData.set(placeId, data);
}

export const winrateRouter = createTRPCRouter({
  winrate: publicProcedure
    .input(
      z.object({
        placeId: z.number().optional(),
        loadout: z.string().optional(),
        map: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.placeId || !placeData.has(input.placeId)) return null;

      const data = placeData.get(input.placeId)!;
      if (input.loadout && !data.metadata.loadouts.includes(input.loadout))
        return null;
      if (input.map && !data.metadata.maps.includes(input.map)) return null;

      const loadout = input.loadout ?? '';
      const map = input.map;

      return data.winrate[map ? `${loadout}-${map}` : loadout];
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
