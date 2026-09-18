import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { listShellsBase } from '@/server/api/trpc/routers/shells/browseIndex';
import { getShellBySlug } from '@/server/api/trpc/routers/shells/detail';
import { computeShellFacets } from '@/server/api/trpc/routers/shells/facets';
import { shellSearchInput } from '@/server/api/trpc/routers/shells/input';
import { searchShells } from '@/server/api/trpc/routers/shells/search';

import type {
  DetailedShell,
  ListedShellBase,
  ShellSearchFacets,
  ShellsListForBrowse,
} from '@/server/api/trpc/routers/shells/types';
import type { PlaceId } from '@generated/config';

export type {
  DetailedShell,
  ListedShellBase,
  ListedShellForBrowse,
  ShellPropertyKey,
  ShellSearchFacets,
  ShellsListForBrowse,
} from '@/server/api/trpc/routers/shells/types';

export const shellsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }): Record<string, ListedShellBase[]> =>
      listShellsBase(input.placeId as PlaceId),
    ),

  searchFacets: publicProcedure
    .input(shellSearchInput)
    .query(({ input }): ShellSearchFacets => computeShellFacets(input)),

  search: publicProcedure
    .input(shellSearchInput)
    .query(({ input }): ShellsListForBrowse => searchShells(input)),

  bySlug: publicProcedure
    .input(z.object({ placeId: z.string(), slug: z.string() }))
    .query(({ input }): DetailedShell | null =>
      getShellBySlug(input.placeId as PlaceId, input.slug),
    ),
});
