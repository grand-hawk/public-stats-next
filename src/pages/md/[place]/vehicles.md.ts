import { markdownTable } from 'markdown-table';

import { createCache } from '@/server/utils/createCache';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getVehicles } from '@generated/vehicles';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';
import type { PlaceName } from '@generated/config';
import type { GetServerSidePropsContext } from 'next';

async function revalidate(placeName: PlaceName) {
  const vehicles = getVehicles();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);

  const vehiclesData = vehicles.data[place.placeId]?.data;
  if (!vehiclesData) return null;

  const entries = Object.entries(vehiclesData)
    .map(([name, data]) => ({
      name: `[${escapeMarkdownLink(name)}](/md/${place.initials}/vehicles/${data.info.slug}.md)`,
      team: data.info.team,
      role: data.info.role,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)) as Omit<
    ListVehicle,
    'slug'
  >[];

  const table = [
    ['Name', 'Team', 'Role'],
    ...entries.map((entry) => [entry.name, entry.team, entry.role]),
  ];

  const markdown = await formatMarkdown(
    `# Vehicles\n\n${markdownTable(table)}`,
  );

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

export default function Vehicles() {
  return null;
}
