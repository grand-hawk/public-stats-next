import React from 'react';

import WeaponTierTabs from '@/components/features/infantryWeapons/tierTabs';
import TitledCard from '@/components/wiki/titledCard';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';

import type { Team } from '@/server/api/trpc/routers/teams';

export default function TeamWeapons({
  initials,
  team,
}: {
  initials: string;
  team: Team;
}) {
  if (Object.keys(team.weapons).length === 0) return null;

  return (
    <TitledCard as="section" title="Infantry items" withAnchor>
      <WeaponTierTabs
        groups={team.weapons}
        initials={initials}
        queryKey="loadout"
        renderHeading={loadoutDisplayName}
        renderLabel={loadoutDisplayName}
      />
    </TitledCard>
  );
}
