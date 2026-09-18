import { HStack } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import VehicleTierTabs from '@/components/features/teams/loadouts/vehicleTierTabs';
import TeamIcon from '@/components/icons/teams';
import { EmptyState } from '@/components/ui/empty-state';
import TitledCard from '@/components/wiki/titledCard';

import type { Loadout } from '@/server/api/trpc/routers/loadouts';

export default function LoadoutTeams({
  initials,
  loadout,
}: {
  initials: string;
  loadout: Loadout;
}) {
  if (Object.keys(loadout.teams).length === 0) {
    return (
      <TitledCard as="section" title="Team vehicles" withAnchor>
        <EmptyState
          icon={<GrDocumentMissing />}
          title="This loadout has no teams"
        />
      </TitledCard>
    );
  }

  return (
    <TitledCard as="section" title="Team vehicles" withAnchor>
      <VehicleTierTabs
        groups={loadout.teams}
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
