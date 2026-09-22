import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { ArticleTable } from '@/components/article/elements';
import { ARTICLE_MDX_CSS } from '@/components/article/prose';
import StatArticleLink from '@/components/wiki/statArticleLink';
import TitledCard from '@/components/wiki/titledCard';
import { usePlaceable } from '@/hooks/providers/placeable';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { slotLabel } from '@/utils/infantryWeapons';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';
import {
  buildToolLabel,
  isBuildAvailability,
  isLoadoutAvailability,
} from '@/utils/placeables';

function LoadoutCell({
  initials,
  loadout,
  loadoutSlug,
}: {
  initials: string;
  loadout?: string;
  loadoutSlug?: string;
}) {
  if (!loadout || !loadoutSlug) return <td>Every loadout</td>;

  return (
    <td>
      <NextLink href={`/${initials}/loadouts/${loadoutSlug}`} prefetch={false}>
        {loadoutDisplayName(loadout)}
      </NextLink>
    </td>
  );
}

function BuildTable() {
  const placeable = usePlaceable();
  const initials = usePlaceInitials()!;

  const rows = placeable.availability.filter(isBuildAvailability);
  if (rows.length === 0) return null;

  return (
    <Box css={ARTICLE_MDX_CSS} marginBlockStart={4}>
      <ArticleTable>
        <thead>
          <tr>
            <th>Loadout</th>
            <th>Tool</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, index) => (
            <tr key={index}>
              <LoadoutCell
                initials={initials}
                loadout={entry.loadout}
                loadoutSlug={entry.loadoutSlug}
              />
              <td>{buildToolLabel(entry.tool)}</td>
              <td>
                {entry.cost} of {entry.cap} points
              </td>
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    </Box>
  );
}

function LoadoutTable() {
  const placeable = usePlaceable();
  const initials = usePlaceInitials()!;

  const rows = placeable.availability.filter(isLoadoutAvailability);
  if (rows.length === 0) return null;

  return (
    <Box css={ARTICLE_MDX_CSS}>
      <ArticleTable>
        <thead>
          <tr>
            <th>Loadout</th>
            <th>Team</th>
            <th>Class</th>
            <th>Slot</th>
            <th>
              <StatArticleLink article="tier">Tier</StatArticleLink>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, index) => (
            <tr key={index}>
              <LoadoutCell
                initials={initials}
                loadout={entry.loadout}
                loadoutSlug={entry.loadoutSlug}
              />
              <td>
                {entry.team && entry.teamSlug ? (
                  <NextLink
                    href={`/${initials}/teams/${entry.teamSlug}`}
                    prefetch={false}
                  >
                    {entry.team}
                  </NextLink>
                ) : (
                  'All teams'
                )}
              </td>
              <td>{entry.class}</td>
              <td>{slotLabel(entry.slot)}</td>
              <td>{entry.tier}</td>
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    </Box>
  );
}

export default function PlaceableAvailability() {
  return (
    <TitledCard as="section" title="Availability" withAnchor>
      <LoadoutTable />
      <BuildTable />
    </TitledCard>
  );
}
