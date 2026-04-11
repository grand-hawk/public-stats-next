import { createHelpers } from '@/server/api/trpc/router';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';

export async function prefetchPlaceSession(initials: string) {
  const { data: config } = getConfig();
  const placeName = getNameFromInitials(config, initials);
  if (!placeName) return null;

  const place = getPlaceFromName(config, placeName);
  const helpers = createHelpers();
  await helpers.config.prefetch();

  return { helpers, place };
}
