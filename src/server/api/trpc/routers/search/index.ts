import Fuse from 'fuse.js';
import slug from 'slug';
import { z } from 'zod';

import { indexableTabKeys, tabs } from '@/components/layout/navigation/tabs';
import { IS_DEV } from '@/env';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

import type { PageRef } from '@/components/common/pageIcon';
import type { PlaceId } from '@generated/config';

export type SearchResultType = PageRef['type'];

export interface SearchResult {
  type: SearchResultType;
  title: string;
  subtitle?: string;
  href: string;
  page: PageRef;
}

interface IndexedItem extends SearchResult {
  searchText: string;
}

const indexCache = new Map<PlaceId, Fuse<IndexedItem>>();

function buildIndex(placeId: PlaceId): Fuse<IndexedItem> {
  const items: IndexedItem[] = [];

  const vehiclesPlace = getVehicles().data[placeId]!;
  const loadoutsPlace = getLoadouts().data[placeId]!;
  const initials =
    getConfig().data.placeNameInitials[loadoutsPlace.metadata.placeName];
  for (const [name, vehicle] of Object.entries(vehiclesPlace.data)) {
    const info = vehicle.info;
    if (info.unlisted) continue;
    items.push({
      type: 'vehicle',
      title: name,
      subtitle: [info.role, info.team].filter(Boolean).join(' · '),
      href: `/${initials}/vehicles/${info.slug}`,
      page: { type: 'vehicle', name, slug: info.slug },
      searchText: [name, info.role, info.team, info.type].join(' '),
    });
  }

  const shellsPlace = getShells().data[placeId]!;
  for (const [weapon, shells] of Object.entries(shellsPlace.data)) {
    for (const shell of shells) {
      items.push({
        type: 'shell',
        title: shell.name,
        subtitle: `${shell.displayType} · ${weapon}`,
        href: `/${initials}/shells/${shell.slug}`,
        page: { type: 'shell', shellType: shell.displayType },
        searchText: [shell.name, shell.displayType, weapon].join(' '),
      });
    }
  }

  const teamNames = new Set<string>(loadoutsPlace.metadata.teams);
  for (const vehicle of Object.values(vehiclesPlace.data)) {
    if (vehicle.info.team && !vehicle.info.unlisted) {
      teamNames.add(vehicle.info.team);
    }
  }
  for (const team of teamNames) {
    items.push({
      type: 'team',
      title: team,
      href: `/${initials}/teams/${slug(team)}`,
      page: { type: 'team', name: team },
      searchText: team,
    });
  }

  for (const loadoutName of loadoutsPlace.metadata.loadouts) {
    const displayName = loadoutDisplayName(loadoutName);
    const loadoutSlug = slug(loadoutName);
    items.push({
      type: 'loadout',
      title: displayName,
      href: `/${initials}/loadouts/${loadoutSlug}`,
      page: { type: 'loadout', slug: loadoutSlug },
      searchText: [displayName, loadoutName].join(' '),
    });
  }

  for (const key of indexableTabKeys) {
    const tab = tabs[key];
    items.push({
      type: 'page',
      title: tab.longLabel ?? tab.label,
      subtitle: tab.description,
      href: `/${initials}${tab.path}`,
      page: { type: 'page' },
      searchText: [tab.label, tab.longLabel, tab.description]
        .filter(Boolean)
        .join(' '),
    });
  }

  return new Fuse(items, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'searchText', weight: 1 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2,
  });
}

function getIndex(placeId: PlaceId) {
  if (IS_DEV) return buildIndex(placeId);
  const cached = indexCache.get(placeId);
  if (cached) return cached;

  const fresh = buildIndex(placeId);
  indexCache.set(placeId, fresh);
  return fresh;
}

const RESULT_LIMIT = 8;
const TYPE_SCORE_PENALTY: Partial<Record<SearchResultType, number>> = {
  shell: 0.15,
};

export const searchRouter = createTRPCRouter({
  query: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        q: z.string().min(1).max(100),
      }),
    )
    .query(({ input }): SearchResult[] => {
      const fuse = getIndex(input.placeId as PlaceId);
      return fuse
        .search(input.q, { limit: RESULT_LIMIT * 4 })
        .map((r) => ({
          item: r.item,
          score: (r.score ?? 1) + (TYPE_SCORE_PENALTY[r.item.type] ?? 0),
        }))
        .sort((a, b) => a.score - b.score)
        .slice(0, RESULT_LIMIT)
        .map(({ item }) => ({
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          href: item.href,
          page: item.page,
        }));
    }),
});
