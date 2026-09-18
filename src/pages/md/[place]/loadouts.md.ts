import { markdownTable } from 'markdown-table';
import slugify from 'slug';

import { createPlaceMarkdownRoute } from '@/server/utils/createMarkdownRoute';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import { getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';

import type { PlaceName } from '@generated/config';

async function render(placeName: PlaceName) {
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
        `[${escapeMarkdownLink(loadoutName)}](/${place.initials}/loadouts/${slugify(loadoutName)}.md)`,
        loadout?.teams.join(', ') ?? '',
        loadout?.description ?? '',
      ];
    }),
  ]);

  return formatMarkdown(`# Loadouts\n\n${table}`);
}

export const getServerSideProps = createPlaceMarkdownRoute('loadouts', render);

export default function Loadouts() {
  return null;
}
