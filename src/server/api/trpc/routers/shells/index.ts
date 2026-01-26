import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getShells } from '@generated/shells';

import type { PlaceId } from '@generated/config';
import type { ShellsPlaceDataShell } from '@generated/shells';
import type { BreadcrumbList, WithContext } from 'schema-dts';

export type DetailedShell = ShellsPlaceDataShell & {
  weapon: string;
  linkedData: Partial<{
    breadcrumbs: WithContext<BreadcrumbList>;
  }>;
};

export const shellsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }) => {
      const shells = getShells();

      const shellsData = shells.data[input.placeId as PlaceId]?.data;
      if (!shellsData) return {}; // This validates placeId

      return Object.fromEntries(
        Object.entries(shellsData)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([weapon, shells]) => [
            weapon,
            shells.map((shell) => ({
              name: shell.name,
              slug: shell.slug,
              vehicles: shell.vehicles,
              type: shell.type,
              displayType: shell.displayType,
            })),
          ]),
      );
    }),

  bySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }) => {
      const shells = getShells();
      const config = getConfig();

      const shellsPlace = shells.data[input.placeId as PlaceId];
      if (!shellsPlace) return null; // This validates placeId

      const [weapon, shellName] = shellsPlace.metadata.slugs[input.slug] || [
        null,
        null,
      ];
      if (!weapon || !shellName) return null; //  This validates slug

      const shell = shellsPlace.data[weapon].find(
        (shell) => shell.name === shellName,
      )!;
      const initials =
        config.data.placeNameInitials[shellsPlace.metadata.placeName];
      const baseUrl = getBaseUrl();

      return {
        ...shell,
        weapon,
        linkedData: {
          breadcrumbs: {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Vehicles',
                item: new URL(`${initials}/vehicles`, baseUrl).toString(),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: weapon,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: shell.name,
              },
            ],
          },
        },
      } as DetailedShell;
    }),
});
