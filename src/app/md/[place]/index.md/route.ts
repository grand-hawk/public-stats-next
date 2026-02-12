import { createCache } from '@/server/utils/createCache';
import { formatMarkdown } from '@/server/utils/formatMarkdown';
import {
  getCachedMarkdown,
  mdResponse,
  resolvePlaceFromParams,
} from '@/server/utils/mdResponse';
import { getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getShells } from '@generated/shells';

import type { PlaceName } from '@generated/config';

const LINKS = [
  { file: 'kdr.md', label: 'K/D table' },
  { file: 'loadouts.md', label: 'Loadouts' },
  { file: 'shells.md', label: 'Shells' },
  { file: 'teams.md', label: 'Teams' },
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
  return formatMarkdown(`# ${place.placeName}\n\n${links}`);
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

  return mdResponse(markdown, new URL(initials, baseUrl).toString());
}
