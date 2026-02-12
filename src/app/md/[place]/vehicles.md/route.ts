import { markdownTable } from 'markdown-table';

import { createCache } from '@/server/utils/createCache';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import {
  getCachedMarkdown,
  mdResponse,
  resolvePlaceFromParams,
} from '@/server/utils/mdResponse';
import { getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getVehicles } from '@generated/vehicles';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';
import type { PlaceName } from '@generated/config';

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
  return formatMarkdown(`# Vehicles\n\n${markdownTable(table)}`);
}

const cache = createCache<PlaceName, string | null>(revalidate);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ place: string }> },
) {
  const { place: initials } = await params;
  const { baseUrl, placeName } = resolvePlaceFromParams(initials);
  if (!placeName) return new Response(null, { status: 404 });

  const markdown = await getCachedMarkdown(cache, revalidate, placeName);
  if (!markdown) return new Response(null, { status: 404 });

  return mdResponse(
    markdown,
    new URL(`${initials}/vehicles`, baseUrl).toString(),
  );
}
