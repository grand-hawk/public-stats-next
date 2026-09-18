import { markdownTable } from 'markdown-table';

import { createPlaceMarkdownRoute } from '@/server/utils/createMarkdownRoute';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import { getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getShells } from '@generated/shells';

import type { PlaceName } from '@generated/config';

async function render(placeName: PlaceName) {
  const shells = getShells();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);

  const shellsData = shells.data[place.placeId]?.data;
  if (!shellsData) return null;

  const weaponTables = Object.entries(shellsData).map(([weapon, shells]) => {
    return `## ${weapon}\n\n${markdownTable([
      ['Shell name', 'Type'],
      ...shells.map((shell) => [
        `[${escapeMarkdownLink(shell.name)}](/${place.initials}/shells/${shell.slug}.md)`,
        shell.type,
      ]),
    ])}`;
  });

  return formatMarkdown(`# Shells\n\n${weaponTables.join('\n\n')}`);
}

export const getServerSideProps = createPlaceMarkdownRoute('shells', render);

export default function Shells() {
  return null;
}
