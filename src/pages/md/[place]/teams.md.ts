import { markdownTable } from 'markdown-table';

import { createCache } from '@/server/utils/createCache';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';

import type { PlaceName } from '@generated/config';
import type { GetServerSidePropsContext } from 'next';

async function revalidate(placeName: PlaceName) {
  const loadouts = getLoadouts();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);

  const loadoutsData = loadouts.data[place.placeId];
  if (!loadoutsData) return null;

  const teams = loadoutsData.metadata.teams;

  const table = markdownTable([
    ['Team name', 'Loadouts'],
    ...teams.map((team) => {
      const teamLoadouts = Object.entries(loadoutsData.data)
        .filter(([, loadout]) => loadout.teams.includes(team))
        .map(([name]) => name);

      return [
        `[${escapeMarkdownLink(team)}](/md/${place.initials}/teams/${encodeURIComponent(team)}.md)`,
        teamLoadouts.join(', '),
      ];
    }),
  ]);

  const markdown = await formatMarkdown(`# Teams\n\n${table}`);

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

export default function Teams() {
  return null;
}
