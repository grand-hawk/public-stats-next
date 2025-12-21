import { markdownTable } from 'markdown-table';

import { createCache } from '@/server/utils/createCache';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getKdr } from '@generated/kdr';
import { getVehicles } from '@generated/vehicles';

import type { PlaceName } from '@generated/config';
import type { KdrPlaceData, KdrPlaceDataVehicle } from '@generated/kdr';
import type { GetServerSidePropsContext } from 'next';

async function revalidate(placeName: PlaceName) {
  const { data } = getConfig();
  const place = getPlaceFromName(data, placeName);

  const kdrData = getKdr().data[place.placeId]?.data;
  if (!kdrData) return null;

  const vehiclesData = getVehicles().data[place.placeId]?.data;

  const aggregatedVehicles: Array<
    { name: string; slug: string } & Partial<
      Record<keyof KdrPlaceData, KdrPlaceDataVehicle>
    >
  > = [];

  for (const name of Object.keys(kdrData.all_time)) {
    const slug = vehiclesData[name]?.info.slug;
    if (!slug) continue;

    aggregatedVehicles.push({
      name,
      slug: name,
      all_time: kdrData.all_time[name],
      recent: kdrData.recent[name],
    });
  }

  const table = markdownTable([
    [
      'Vehicle',
      'All time K/D',
      'All time kills',
      'All time deaths',
      'Recent K/D',
      'Recent kills',
      'Recent deaths',
    ],
    ...aggregatedVehicles.map((vehicle) => [
      `[${escapeMarkdownLink(vehicle.name)}](/md/${place.initials}/vehicles/${vehicle.slug}.md)`,
      vehicle.all_time?.kdr.toString() || '',
      vehicle.all_time?.kills.toString() || '',
      vehicle.all_time?.deaths.toString() || '',
      vehicle.recent?.kdr.toString() || '',
      vehicle.recent?.kills.toString() || '',
      vehicle.recent?.deaths.toString() || '',
    ]),
  ]);

  const markdown = await formatMarkdown(`# K/D table\n\n${table}`);

  return markdown;
}

const cache = createCache(revalidate);

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

export default function Kdr() {
  return null;
}
