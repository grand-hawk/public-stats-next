import slug from 'slug';

import { createContentCollection } from '@/server/utils/contentCollection';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { PageRef } from '@/components/common/pageIcon';
import type { PlaceId } from '@generated/config';

export interface PageSource {
  path: string;
  title: string;
  page: PageRef;
  body: string;
  keywords: string;
}

const bodies = {
  loadouts: createContentCollection({
    dir: 'content/loadouts',
    parseMeta: () => ({}),
  }),
  teams: createContentCollection({
    dir: 'content/teams',
    parseMeta: () => ({}),
  }),
};

function readBody(kind: keyof typeof bodies, entry: string): string {
  return bodies[kind].get(entry)?.body ?? '';
}

export function collectSources(placeId: PlaceId): PageSource[] {
  const sources: PageSource[] = [];
  const vehiclesPlace = getVehicles().data[placeId];
  const loadoutsPlace = getLoadouts().data[placeId];

  for (const [name, vehicle] of Object.entries(vehiclesPlace?.data ?? {})) {
    const { info } = vehicle;
    if (info.unlisted) continue;

    sources.push({
      path: `/vehicles/${info.slug}`,
      title: name,
      page: { type: 'vehicle', name, slug: info.slug },
      body: info.description,
      keywords: `${info.class} ${info.role} ${info.team} ${info.type} ${info.locomotion}`,
    });
  }

  if (!loadoutsPlace) return sources;

  const playableTeams = new Set(loadoutsPlace.metadata.teams);
  const teamNames = new Set(playableTeams);
  for (const vehicle of Object.values(vehiclesPlace?.data ?? {})) {
    if (vehicle.info.team) teamNames.add(vehicle.info.team);
  }

  for (const name of teamNames) {
    const teamSlug = slug(name);

    sources.push({
      path: `/teams/${teamSlug}`,
      title: name,
      page: { type: 'team', name },
      body: readBody('teams', teamSlug),
      keywords: playableTeams.has(name) ? 'Playable team' : 'Lore team',
    });
  }

  for (const name of loadoutsPlace.metadata.loadouts) {
    const loadoutSlug = slug(name);

    sources.push({
      path: `/loadouts/${loadoutSlug}`,
      title: loadoutDisplayName(name),
      page: { type: 'loadout', slug: loadoutSlug },
      body: readBody('loadouts', loadoutSlug),
      keywords: loadoutsPlace.data[name]?.description ?? '',
    });
  }

  return sources;
}
