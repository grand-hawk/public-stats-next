import slug from 'slug';

import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getConfig();
  const vehicles = getVehicles();
  const loadouts = getLoadouts();
  const shells = getShells();

  const baseUrl = getBaseUrl();
  const entries: MetadataRoute.Sitemap = [];
  const placeNames = config.data.placeNames;

  entries.push({
    url: baseUrl || '/',
    changeFrequency: 'weekly',
    priority: 1,
  });

  for (const placeName of placeNames) {
    const initials = config.data.placeNameInitials[placeName];
    const placeId = config.data.placeIds[placeName];
    const isFirstPlace = placeNames.indexOf(placeName) === 0;

    const vehicleSlugs = vehicles.data[placeId].metadata.slugs;
    const loadoutsPlace = loadouts.data[placeId];
    const shellsPlace = shells.data[placeId];

    entries.push({
      url: new URL(initials, baseUrl).toString(),
      changeFrequency: 'weekly',
      priority: isFirstPlace ? 1 : 0.9,
    });

    entries.push({
      url: new URL(`${initials}/kdr`, baseUrl).toString(),
      changeFrequency: 'weekly',
      priority: isFirstPlace ? 0.8 : 0.7,
    });
    entries.push({
      url: new URL(`${initials}/winrate`, baseUrl).toString(),
      changeFrequency: 'weekly',
      priority: isFirstPlace ? 0.8 : 0.7,
    });

    entries.push({
      url: new URL(`${initials}/vehicles`, baseUrl).toString(),
      changeFrequency: 'weekly',
      priority: isFirstPlace ? 0.9 : 0.8,
    });
    for (const vehicleSlug of Object.keys(vehicleSlugs))
      entries.push({
        url: new URL(`${initials}/vehicles/${vehicleSlug}`, baseUrl).toString(),
        changeFrequency: 'monthly',
        priority: isFirstPlace ? 0.6 : 0.4,
      });

    if (loadoutsPlace) {
      entries.push({
        url: new URL(`${initials}/teams`, baseUrl).toString(),
        changeFrequency: 'weekly',
        priority: isFirstPlace ? 0.8 : 0.7,
      });
      for (const team of loadoutsPlace.metadata.teams)
        entries.push({
          url: new URL(`${initials}/teams/${slug(team)}`, baseUrl).toString(),
          changeFrequency: 'monthly',
          priority: isFirstPlace ? 0.6 : 0.4,
        });

      entries.push({
        url: new URL(`${initials}/loadouts`, baseUrl).toString(),
        changeFrequency: 'weekly',
        priority: isFirstPlace ? 0.8 : 0.7,
      });
      for (const loadoutName of loadoutsPlace.metadata.loadouts)
        entries.push({
          url: new URL(
            `${initials}/loadouts/${slug(loadoutName)}`,
            baseUrl,
          ).toString(),
          changeFrequency: 'monthly',
          priority: isFirstPlace ? 0.6 : 0.4,
        });
    }

    if (shellsPlace) {
      entries.push({
        url: new URL(`${initials}/shells`, baseUrl).toString(),
        changeFrequency: 'weekly',
        priority: isFirstPlace ? 0.8 : 0.7,
      });
      for (const shellSlug of Object.keys(shellsPlace.metadata.slugs))
        entries.push({
          url: new URL(
            `${initials}/shells/${shellSlug}`,
            baseUrl,
          ).toString(),
          changeFrequency: 'monthly',
          priority: isFirstPlace ? 0.5 : 0.3,
        });
    }
  }

  return entries;
}
