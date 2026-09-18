import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import VehicleTierTabs from '@/components/features/teams/loadouts/vehicleTierTabs';
import { EmptyState } from '@/components/ui/empty-state';
import TitledCard from '@/components/wiki/titledCard';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';

import type { Team } from '@/server/api/trpc/routers/teams';

export default function TeamLoadouts({
  initials,
  team,
}: {
  initials: string;
  team: Team;
}) {
  if (Object.keys(team.loadouts).length === 0) {
    return (
      <TitledCard as="section" title="Loadouts" withAnchor>
        <EmptyState
          icon={<GrDocumentMissing />}
          title="This team has no loadouts"
        />
      </TitledCard>
    );
  }

  return (
    <TitledCard as="section" title="Playable vehicles" withAnchor>
      <VehicleTierTabs
        groups={team.loadouts}
        initials={initials}
        queryKey="loadout"
        renderHeading={loadoutDisplayName}
        renderLabel={loadoutDisplayName}
      />
    </TitledCard>
  );
}
