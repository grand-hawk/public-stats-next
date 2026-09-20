import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { ERA_PANEL_NAMES } from '@/content/eraPanelNames';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getArticle, listArticles } from '@/server/utils/articles';
import { groupApsSystems } from '@/server/utils/articles/aps';
import {
  groupEraPanels,
  sourcesFromVehicles,
} from '@/server/utils/articles/eraPanels';
import { getGlossary } from '@/server/utils/articles/glossary';
import { getNavigation } from '@/server/utils/articles/navigation';
import { resolveRefs } from '@/server/utils/articles/resolve';
import { queryShells } from '@/server/utils/articles/shellQuery';
import { computeRelatedPages } from '@/server/utils/relatedPages';
import { getNameFromInitials, getNameFromPlaceId } from '@/utils/placeUtils';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

import type { ApsSystem } from '@/server/utils/articles/aps';
import type {
  EraPanelVehicle,
  EraPanels,
} from '@/server/utils/articles/eraPanels';
import type { GlossaryTerm } from '@/server/utils/articles/glossary';
import type { NavGroup, NavLink } from '@/server/utils/articles/navigation';
import type { ArticleMeta, OutlineItem } from '@/server/utils/articles/parse';
import type { ResolvedRefs } from '@/server/utils/articles/resolve';
import type { ShellQueryResult } from '@/server/utils/articles/shellQuery';
import type { RelatedPageItem } from '@/server/utils/relatedPages';
import type { PlaceId } from '@generated/config';

export interface Article {
  slug: string;
  meta: ArticleMeta;
  outline: OutlineItem[];
  refs: ResolvedRefs;
  relatedPages: RelatedPageItem[];
  linkedData: Record<string, unknown>;
}

export type { GlossaryTerm, NavGroup, NavLink, OutlineItem, ResolvedRefs };

function getInitials(placeId: PlaceId): string | undefined {
  const { data } = getConfig();
  const placeName = getNameFromPlaceId(data, placeId);

  return placeName ? data.placeNameInitials[placeName] : undefined;
}

function availableVehicles(placeId: PlaceId) {
  const inLoadout = new Set<string>();
  for (const loadout of Object.values(
    getLoadouts().data[placeId]?.data ?? {},
  )) {
    for (const name of Object.keys(loadout.vehicles)) inLoadout.add(name);
  }

  const available = new Map<string, EraPanelVehicle>();
  for (const [name, vehicle] of Object.entries(
    getVehicles().data[placeId]?.data ?? {},
  )) {
    if (!inLoadout.has(name)) continue;
    available.set(vehicle.info.gameId, { name, slug: vehicle.info.slug });
  }

  return available;
}

export const articlesRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(z.object({ placeId: z.string(), slug: z.string().max(200) }))
    .query(({ input }): Article | null => {
      const placeId = input.placeId as PlaceId;
      const placeName = getNameFromPlaceId(getConfig().data, placeId);
      const article = placeName ? getArticle(input.slug, placeName) : null;
      const initials = getInitials(placeId);
      if (!article || !initials) return null;

      const articleTitles = new Map(
        listArticles(placeName ?? undefined).map(({ meta, slug }) => [
          slug,
          meta.title,
        ]),
      );

      return {
        slug: article.slug,
        meta: article.meta,
        outline: article.outline,
        refs: resolveRefs(article.refs, {
          vehicles: getVehicles().data[placeId]?.data ?? {},
          shells: getShells().data[placeId]?.data ?? {},
          articleTitles,
          glossary: getGlossary(),
        }),
        relatedPages: computeRelatedPages(
          placeId,
          initials,
          `/${article.slug}`,
        ),
        linkedData: {
          article: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.meta.title,
            description: article.meta.summary,
            dateModified: article.meta.updated,
            mainEntityOfPage: new URL(
              `${initials}/${article.slug}`,
              getBaseUrl(),
            ).toString(),
          },
        },
      };
    }),

  assertExists: publicProcedure
    .input(z.object({ placeId: z.string(), slug: z.string().max(200) }))
    .query(({ input }): true => {
      const placeName = getNameFromPlaceId(
        getConfig().data,
        input.placeId as PlaceId,
      );

      if (!placeName || !getArticle(input.slug, placeName)) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return true;
    }),

  shells: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        displayTypes: z.array(z.string().max(100)).max(20).optional(),
        eraTip: z.number().optional(),
        typeIncludes: z.string().max(100).optional(),
      }),
    )
    .query(({ input }): ShellQueryResult[] =>
      queryShells(getShells().data[input.placeId as PlaceId]?.data ?? {}, {
        displayTypes: input.displayTypes,
        eraTip: input.eraTip,
        typeIncludes: input.typeIncludes,
      }),
    ),

  aps: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }): ApsSystem[] => {
      const placeId = input.placeId as PlaceId;
      return groupApsSystems(
        getVehicles().data[placeId]?.data ?? {},
        availableVehicles(placeId),
      );
    }),

  eraPanels: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }): EraPanels => {
      const placeId = input.placeId as PlaceId;
      const available = availableVehicles(placeId);

      const exported = sourcesFromVehicles(
        getVehicles().data[placeId]?.data ?? {},
      );

      const eraTips = Object.values(getShells().data[placeId]?.data ?? {})
        .flat()
        .flatMap((shell) => (shell.eraTip ? [shell.eraTip] : []));

      return groupEraPanels(
        exported ?? [],
        ERA_PANEL_NAMES,
        available,
        eraTips,
      );
    }),

  navigation: publicProcedure
    .input(z.object({ initials: z.string().max(10) }))
    .query(({ input }): NavGroup[] =>
      getNavigation(
        getNameFromInitials(getConfig().data, input.initials) ?? undefined,
      ),
    ),

  glossary: publicProcedure.query((): GlossaryTerm[] => getGlossary()),
});
