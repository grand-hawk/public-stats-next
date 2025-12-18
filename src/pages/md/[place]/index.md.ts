import Cache from 'stale-lru-cache';

import { env } from '@/env';
import { formatMarkdown } from '@/server/utils/formatMarkdown';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getShells } from '@generated/shells';

import type { PlaceName } from '@generated/config';
import type { GetServerSidePropsContext } from 'next';

async function revalidate(placeName: PlaceName) {
  const { data } = getConfig();
  const place = getPlaceFromName(data, placeName);

  const shellsData = getShells().data[place.placeId]?.data;
  if (!shellsData) return null;

  const baseUrl = getBaseUrl();
  const files = ['shells.md', 'vehicles.md'];

  const markdown = await formatMarkdown(
    `# ${place.placeName}\n\n${files.map((file) => `- [${file}](${new URL(`/md/${place.initials}/${file}`, baseUrl).toString()})`).join('\n')}`,
  );

  return markdown;
}

const cache = new Cache({
  maxAge: env.NODE_ENV === 'development' ? 0 : 3600,
  staleWhileRevalidate: env.NODE_ENV === 'development' ? 0 : 86400,
  revalidate,
});

export async function getServerSideProps({
  params,
  res,
}: GetServerSidePropsContext) {
  const { place: initials } = params || {};
  if (!initials || typeof initials !== 'string') return { notFound: true };

  const { data } = getConfig();
  const placeName = getNameFromInitials(data, initials);
  if (!placeName) return { notFound: true };

  let markdown = await cache.get(placeName);
  if (!markdown) {
    markdown = await revalidate(placeName);
    cache.set(placeName, markdown);
  }

  if (markdown === null) return { notFound: true };

  res.setHeader('content-type', 'text/markdown; charset=utf-8');
  res.setHeader(
    'cache-control',
    'public, max-age=3600, stale-while-revalidate=86400',
  );

  res.write(markdown);

  res.end();

  return { props: {} };
}

export default function Index() {
  return null;
}
