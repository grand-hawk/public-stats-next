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
import { getLoadouts } from '@generated/loadouts';

import type { PlaceName } from '@generated/config';

async function revalidate(placeName: PlaceName) {
  const loadouts = getLoadouts();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);
  const loadoutsData = loadouts.data[place.placeId];
  if (!loadoutsData) return null;

  const loadoutNames = loadoutsData.metadata.loadouts;
  const table = markdownTable([
    ['Loadout name', 'Teams', 'Description'],
    ...loadoutNames.map((loadoutName) => {
      const loadout = loadoutsData.data[loadoutName];
      return [
        `[${escapeMarkdownLink(loadoutName)}](/md/${place.initials}/loadouts/${encodeURIComponent(loadoutName)}.md)`,
        loadout?.teams.join(', ') ?? '',
        loadout?.description ?? '',
      ];
    }),
  ]);
  return formatMarkdown(`# Loadouts\n\n${table}`);
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
    new URL(`${initials}/loadouts`, baseUrl).toString(),
  );
}
