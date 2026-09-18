import { TRPCError } from '@trpc/server';

import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getShells } from '@generated/shells';

import type { DetailedShell } from '@/server/api/trpc/routers/shells/types';
import type { PlaceId } from '@generated/config';

export function getShellBySlug(
  placeId: PlaceId,
  shellSlug: string,
): DetailedShell | null {
  const shellsPlace = getShells().data[placeId];
  if (!shellsPlace) throw new TRPCError({ code: 'NOT_FOUND' });

  const [weapon, shellName] = shellsPlace.metadata.slugs[shellSlug] || [
    null,
    null,
  ];
  if (!weapon || !shellName) return null;

  const shell = shellsPlace.data[weapon].find(
    (candidate) => candidate.name === shellName,
  )!;
  const initials =
    getConfig().data.placeNameInitials[shellsPlace.metadata.placeName];
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
            item: new URL(
              `${initials}/shells?q=${encodeURIComponent(weapon)}`,
              baseUrl,
            ).toString(),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: shell.name,
          },
        ],
      },
    },
  };
}
