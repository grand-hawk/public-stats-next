import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { ERA_PANEL_NAMES } from '@/content/eraPanelNames';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getArticle, listArticles } from '@/server/utils/articles';
import {
  groupEraPanels,
  sourcesFromVehicles,
} from '@/server/utils/articles/eraPanels';
import { getGlossary } from '@/server/utils/articles/glossary';
import { getNavigation } from '@/server/utils/articles/navigation';
import { resolveRefs } from '@/server/utils/articles/resolve';
import { queryShells } from '@/server/utils/articles/shellQuery';
import { computeRelatedPages } from '@/server/utils/relatedPages';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

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
  const { placeIds, placeNameInitials } = getConfig().data;
  const placeName = Object.entries(placeIds).find(
    ([, id]) => id === placeId,
  )?.[0];

  return placeName
    ? placeNameInitials[placeName as keyof typeof placeNameInitials]
    : undefined;
}

export const articlesRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(z.object({ placeId: z.string(), slug: z.string().max(200) }))
    .query(({ input }): Article | null => {
      const placeId = input.placeId as PlaceId;
      const article = getArticle(input.slug);
      const initials = getInitials(placeId);
      if (!article || !initials) return null;

      const articleTitles = new Map(
        listArticles().map(({ meta, slug }) => [slug, meta.title]),
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
    .input(z.object({ slug: z.string().max(200) }))
    .query(({ input }): true => {
      if (!getArticle(input.slug)) throw new TRPCError({ code: 'NOT_FOUND' });
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

  eraPanels: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }): EraPanels => {
      const placeId = input.placeId as PlaceId;
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

  navigation: publicProcedure.query((): NavGroup[] => getNavigation()),

  glossary: publicProcedure.query((): GlossaryTerm[] => getGlossary()),
});
