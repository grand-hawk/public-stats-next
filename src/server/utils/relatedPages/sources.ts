import slug from 'slug';

import { listArticles } from '@/server/utils/articles';
import {
  GLOSSARY_SLUG,
  getGlossary,
} from '@/server/utils/articles/glossary';
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
  outbound?: string[];
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

  const slugByGameId = new Map<string, string>();
  for (const { info } of Object.values(vehiclesPlace?.data ?? {})) {
    if (!info.unlisted) slugByGameId.set(info.gameId, info.slug);
  }

  const termArticles = new Map(
    getGlossary().flatMap((term) =>
      term.article ? [[term.id, term.article.split('#')[0]] as const] : [],
    ),
  );

  for (const article of listArticles()) {
    sources.push({
      path: `/${article.slug}`,
      title: article.meta.title,
      page: { type: 'article' },
      body: article.text,
      keywords: article.meta.summary,
      outbound: [
        ...article.refs.articles.map((ref) => `/${ref.slug}`),
        ...article.refs.terms.flatMap((id) => {
          const target = termArticles.get(id);
          return target ? [`/${target}`] : [];
        }),
        ...(article.refs.terms.length > 0 ? [`/${GLOSSARY_SLUG}`] : []),
        ...article.refs.teams.map((team) => `/teams/${slug(team)}`),
        ...article.refs.vehicles.flatMap((id) => {
          const vehicleSlug = slugByGameId.get(id);
          return vehicleSlug ? [`/vehicles/${vehicleSlug}`] : [];
        }),
      ],
    });
  }

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
