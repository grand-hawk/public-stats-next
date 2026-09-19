import { HStack } from '@chakra-ui/react';
import React from 'react';

import WeaponTierTabs from '@/components/features/infantryWeapons/tierTabs';
import TeamIcon from '@/components/icons/teams';
import TitledCard from '@/components/wiki/titledCard';

import type { Loadout } from '@/server/api/trpc/routers/loadouts';

export default function LoadoutWeapons({
  initials,
  loadout,
}: {
  initials: string;
  loadout: Loadout;
}) {
  if (Object.keys(loadout.weapons).length === 0) return null;

  return (
    <TitledCard as="section" title="Team infantry weapons" withAnchor>
      <WeaponTierTabs
        groups={loadout.weapons}
        initials={initials}
        queryKey="team"
        renderHeading={(team) => team}
        renderLabel={(team) => (
          <HStack gap="8px">
            <TeamIcon size="20px" team={team} />
            <span>{team}</span>
          </HStack>
        )}
      />
    </TitledCard>
  );
}
