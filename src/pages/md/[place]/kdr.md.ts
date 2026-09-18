import { markdownTable } from 'markdown-table';

import { KDR_RANGE_ITEMS } from '@/components/features/kdr/rangeSelect';
import { createPlaceMarkdownRoute } from '@/server/utils/createMarkdownRoute';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import { getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getKdr } from '@generated/kdr';
import { getVehicles } from '@generated/vehicles';

import type { PlaceName } from '@generated/config';
import type { KdrPlaceData, KdrPlaceDataVehicle } from '@generated/kdr';

async function render(placeName: PlaceName) {
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
      slug,
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
    `[${escapeMarkdownLink(vehicle.name)}](/${place.initials}/vehicles/${vehicle.slug}.md)`,
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

  return formatMarkdown(`# K/D table\n\n${table}`);
}

export const getServerSideProps = createPlaceMarkdownRoute('kdr', render);

export default function Kdr() {
  return null;
}
