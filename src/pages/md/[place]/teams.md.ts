import { markdownTable } from 'markdown-table';

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

  const teams = loadoutsData.metadata.teams;

  const table = markdownTable([
    ['Team name', 'Loadouts'],
    ...teams.map((team) => {
      const teamLoadouts = Object.entries(loadoutsData.data)
        .filter(([, loadout]) => loadout.teams.includes(team))
        .map(([name]) => name);

      return [
        `[${escapeMarkdownLink(team)}](/${place.initials}/teams/${encodeURIComponent(team)}.md)`,
        teamLoadouts.join(', '),
      ];
    }),
  ]);

  return formatMarkdown(`# Teams\n\n${table}`);
}

export const getServerSideProps = createPlaceMarkdownRoute('teams', render);

export default function Teams() {
  return null;
}
