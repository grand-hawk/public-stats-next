import fs from 'node:fs/promises';

import places_json from '@config/places.json';
import { request } from '@scripts/updateData.utils.mjs';

const places = places_json as Record<string, number>;

async function getWinrate(
  placeId: string | number,
  loadout?: string,
  map?: string,
) {
  return request(`match/data/winrate`, {
    searchParams: new URLSearchParams({
      placeId: String(placeId),
      ...(loadout && { loadout }),
      ...(map && { map }),
    }),
  }).json<Record<string, Array<{ date: string; winrate: number }>>>();
}

async function getDistinct(placeId: string | number) {
  return request(`match/data/distinct/${placeId}`, {}).json<{
    loadout: string[];
    map: string[];
  }>();
}

for (const [, placeId] of Object.entries(places)) {
  await fs.mkdir(`./data/winrate/${placeId}`, { recursive: true });

  const distinct = await getDistinct(placeId);

  await fs.writeFile(
    `./data/winrate/${placeId}/metadata.json`,
    JSON.stringify({
      date: new Date().toISOString(),
      loadouts: distinct.loadout,
      maps: distinct.map,
    }),
  );

  const winrate = await getWinrate(placeId);
  await fs.writeFile(
    `./data/winrate/${placeId}/winrate.json`,
    JSON.stringify(winrate),
  );

  for (const loadout of distinct.loadout) {
    const loadoutWinrate = await getWinrate(placeId, loadout);
    await fs.writeFile(
      `./data/winrate/${placeId}/winrate-${loadout}.json`,
      JSON.stringify(loadoutWinrate),
    );

    for (const map of distinct.map) {
      const combinedWinrate = await getWinrate(placeId, loadout, map);
      await fs.writeFile(
        `./data/winrate/${placeId}/winrate-${loadout}-${map}.json`,
        JSON.stringify(combinedWinrate),
      );
    }
  }
}
