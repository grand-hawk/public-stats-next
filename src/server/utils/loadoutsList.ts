import { TRPCError } from '@trpc/server';
import slug from 'slug';

import { MEDIA_PREFIX } from '@/env';
import { getLoadouts } from '@generated/loadouts';

import type { PlaceId } from '@generated/config';

export interface LoadoutListItem {
  description: string;
  name: string;
  slug: string;
  thumbnail: string;
}

export function getLoadoutListItems(placeId: PlaceId): LoadoutListItem[] {
  const loadouts = getLoadouts();

  const loadoutsPlace = loadouts.data[placeId];
  if (!loadoutsPlace) throw new TRPCError({ code: 'NOT_FOUND' });

  return loadoutsPlace.metadata.loadouts.map((loadoutName) => {
    const loadoutSlug = slug(loadoutName);
    const loadoutData = loadoutsPlace.data[loadoutName];

    return {
      description: loadoutData?.description ?? '',
      name: loadoutName,
      slug: loadoutSlug,
      thumbnail: `${MEDIA_PREFIX}/assets/loadouts/thumbnails/${loadoutSlug}.png`,
    };
  });
}
