import { getNameFromInitials } from '@/utils/placeUtils';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';

import type { PlaceName } from '@generated/config';

export function mdResponse(markdown: string, canonicalUrl: string) {
  return new Response(markdown, {
    headers: {
      Link: `<${canonicalUrl}>; rel="canonical"`,
      'X-Robots-Tag': 'noindex',
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

export function resolvePlaceFromParams(initials: string) {
  const { data: config } = getConfig();
  const placeName = getNameFromInitials(config, initials);
  return { config, placeName, baseUrl: getBaseUrl() };
}

export async function getCachedMarkdown(
  cache: {
    get: (key: PlaceName) => string | null | undefined;
    set: (key: PlaceName, value: string | null) => void;
  },
  revalidateFn: (placeName: PlaceName) => Promise<string | null>,
  placeName: PlaceName,
) {
  let markdown = cache.get(placeName);
  if (!markdown) {
    markdown = await revalidateFn(placeName);
    cache.set(placeName, markdown);
  }
  return markdown;
}
