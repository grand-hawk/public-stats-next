import 'server-only';

import { cache } from 'react';

import { createHelpers } from '@/server/api/trpc/router';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';

export const getHelpers = cache(createHelpers);

export async function prefetchConfig(helpers: ReturnType<typeof createHelpers>) {
  await helpers.config.prefetch();
  return helpers.config.fetch();
}

export async function prefetchPlace(placeInitials: string) {
  const helpers = getHelpers();
  const config = await prefetchConfig(helpers);
  const placeName = getNameFromInitials(config.data, placeInitials);
  const place = placeName ? getPlaceFromName(config.data, placeName) : null;

  return { helpers, place };
}
