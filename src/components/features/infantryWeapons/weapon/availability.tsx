import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { ArticleTable } from '@/components/article/elements';
import { ARTICLE_MDX_CSS } from '@/components/article/prose';
import StatArticleLink from '@/components/wiki/statArticleLink';
import TitledCard from '@/components/wiki/titledCard';
import { useInfantryWeapon } from '@/hooks/providers/infantryWeapon';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { slotLabel } from '@/utils/infantryWeapons';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';

import type { InfantryWeaponAvailability } from '@/server/api/trpc/routers/infantryWeapons';

function requirement(entry: InfantryWeaponAvailability) {
  const parts: string[] = [];
  if (entry.gamepass) parts.push('Gamepass');
  return parts.join(', ');
}

export default function InfantryWeaponAvailabilityTable() {
  const weapon = useInfantryWeapon();
  const initials = usePlaceInitials()!;

  if (weapon.availability.length === 0) return null;

  const hasRequirements = weapon.availability.some(
    (entry) => requirement(entry) !== '',
  );

  return (
    <TitledCard as="section" title="Availability" withAnchor>
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
              {hasRequirements && <th>Unlocked with</th>}
            </tr>
          </thead>
          <tbody>
            {weapon.availability.map((entry, index) => (
              <tr key={index}>
                <td>
                  <NextLink
                    href={`/${initials}/loadouts/${entry.loadoutSlug}`}
                    prefetch={false}
                  >
                    {loadoutDisplayName(entry.loadout)}
                  </NextLink>
                </td>
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
                <td>{entry.tier ?? 1}</td>
                {hasRequirements && <td>{requirement(entry)}</td>}
              </tr>
            ))}
          </tbody>
        </ArticleTable>
      </Box>
    </TitledCard>
  );
}
