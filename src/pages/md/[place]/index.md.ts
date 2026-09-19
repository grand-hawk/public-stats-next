import { getNavigation } from '@/server/utils/articles/navigation';
import { createPlaceMarkdownRoute } from '@/server/utils/createMarkdownRoute';
import { formatMarkdown } from '@/server/utils/formatMarkdown';
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

async function render(placeName: PlaceName) {
  const shells = getShells();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);

  const shellsData = shells.data[place.placeId]?.data;
  if (!shellsData) return null;

  const links = LINKS.map(
    ({ file, label }) => `- [${label}](/${place.initials}/${file})`,
  ).join('\n');

  const articles = getNavigation().flatMap((group) => {
    const items = group.links.flatMap((link) =>
      link.kind === 'article'
        ? [
            `- [${link.title}](/${place.initials}/${link.slug}.md): ${link.summary}`,
          ]
        : [],
    );

    return items.length > 0 ? [`## ${group.label}\n\n${items.join('\n')}`] : [];
  });

  return formatMarkdown(
    [`# ${place.placeName}`, links, ...articles].join('\n\n'),
  );
}

export const getServerSideProps = createPlaceMarkdownRoute(null, render);

export default function Index() {
  return null;
}
