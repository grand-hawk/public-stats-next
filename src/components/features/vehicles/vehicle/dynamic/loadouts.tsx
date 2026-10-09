import React from 'react';

import SimpleSelect from '@/components/common/simpleSelect';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { useVehicle } from '@/hooks/providers/vehicle';

export default function VehicleDynamicLoadouts() {
  const vehicle = useVehicle();
  const { selectedLoadout, setSelectedLoadout } = useDynamicData();

  const loadouts = Object.entries(vehicle.alterations.loadouts);
  const isTeamBased = loadouts.every(([, loadout]) => loadout.team);

  if (isTeamBased) {
    return (
      <TitledCard
        title="Team"
        tooltip="Select version of the vehicle used by a certain team"
        withAnchor="loadout-config"
      >
        <SimpleSelect
          aria-label="Team"
          items={loadouts.map(([, loadout]) => loadout.team!)}
          maxWidth="20rem"
          noValueLabel={vehicle.info.team}
          value={
            selectedLoadout
              ? (vehicle.alterations.loadouts[selectedLoadout]?.team ?? null)
              : null
          }
          width="100%"
          onValueChange={(team) =>
            setSelectedLoadout(
              loadouts.find(([, loadout]) => loadout.team === team)?.[0] ??
                null,
            )
          }
        />
      </TitledCard>
    );
  }

  return (
    <TitledCard
      title="Loadout"
      tooltip="Select version of the vehicle in a certain loadout"
      withAnchor="loadout-config"
    >
      <SimpleSelect
        aria-label="Loadout"
        items={loadouts.map(([name]) => name)}
        maxWidth="20rem"
        value={selectedLoadout}
        width="100%"
        onValueChange={setSelectedLoadout}
      />
    </TitledCard>
  );
}
