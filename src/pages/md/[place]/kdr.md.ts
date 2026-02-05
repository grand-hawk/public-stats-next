import { markdownTable } from 'markdown-table';

import { KDR_RANGE_ITEMS } from '@/components/features/kdr/rangeSelect';
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
  const kdr = getKdr();
  const vehicles = getVehicles();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);

  const kdrData = kdr.data[place.placeId]?.data;
  if (!kdrData) return null;

  const vehiclesData = vehicles.data[place.placeId]?.data;

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

  const headers = [
    'Vehicle',
    ...KDR_RANGE_ITEMS.flatMap((range) => [
      `${range.label} K/D`,
      `${range.label} kills`,
      `${range.label} deaths`,
    ]),
  ];

  const dataRows = aggregatedVehicles.map((vehicle) => [
    `[${escapeMarkdownLink(vehicle.name)}](/md/${place.initials}/vehicles/${vehicle.slug}.md)`,
    ...KDR_RANGE_ITEMS.flatMap((range) => {
      const rangeKey = range.value as keyof KdrPlaceData;
      const vehicleData = vehicle[rangeKey];
      return [
        vehicleData?.kdr.toString() || '',
        vehicleData?.kills.toString() || '',
        vehicleData?.deaths.toString() || '',
      ];
    }),
  ]);

  const table = markdownTable([headers, ...dataRows]);
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

export default function Kdr() {
  return null;
}
