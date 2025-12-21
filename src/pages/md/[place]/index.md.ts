import { createCache } from '@/server/utils/createCache';
import { formatMarkdown } from '@/server/utils/formatMarkdown';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getShells } from '@generated/shells';

import type { PlaceName } from '@generated/config';
import type { GetServerSidePropsContext } from 'next';

const LINKS = [
  { file: 'kdr.md', label: 'K/D table' },
  { file: 'shells.md', label: 'Shells' },
  { file: 'vehicles.md', label: 'Vehicles' },
];

async function revalidate(placeName: PlaceName) {
  const shells = getShells();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);

  const shellsData = shells.data[place.placeId]?.data;
  if (!shellsData) return null;

  const links = LINKS.map(
    ({ file, label }) => `- [${label}](/md/${place.initials}/${file})`,
  ).join('\n');

  const markdown = await formatMarkdown(`# ${place.placeName}\n\n${links}`);

  return markdown;
}

const cache = createCache(revalidate);

export async function getServerSideProps({
  params,
  res,
}: GetServerSidePropsContext) {
  const { place: initials } = params || {};
  if (!initials || typeof initials !== 'string') return { notFound: true };

  const { data: config } = getConfig();
  const placeName = getNameFromInitials(config, initials);
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
