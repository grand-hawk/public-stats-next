import { markdownTable } from 'markdown-table';

import { createPlaceMarkdownRoute } from '@/server/utils/createMarkdownRoute';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import { getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getVehicles } from '@generated/vehicles';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';
import type { PlaceName } from '@generated/config';

async function render(placeName: PlaceName) {
  const vehicles = getVehicles();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);

  const vehiclesData = vehicles.data[place.placeId]?.data;
  if (!vehiclesData) return null;

  const entries = Object.entries(vehiclesData)
    .filter(([, data]) => !data.info.unlisted)
    .map(([name, data]) => ({
      name: `[${escapeMarkdownLink(name)}](/${place.initials}/vehicles/${data.info.slug}.md)`,
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

  return formatMarkdown(`# Vehicles\n\n${markdownTable(table)}`);
}

export const getServerSideProps = createPlaceMarkdownRoute('vehicles', render);

export default function Vehicles() {
  return null;
}
