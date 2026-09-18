import React from 'react';

import SimpleSelect from '@/components/common/simpleSelect';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { useVehicle } from '@/hooks/providers/vehicle';

export default function VehicleDynamicLoadouts() {
  const vehicle = useVehicle();
  const { selectedLoadout, setSelectedLoadout } = useDynamicData();

  return (
    <TitledCard
      title="Loadout"
      tooltip="Select version of the vehicle in a certain loadout"
      withAnchor="loadout-config"
    >
      <SimpleSelect
        aria-label="Loadout"
        items={Object.keys(vehicle.alterations.loadouts)}
        maxWidth="20rem"
        value={selectedLoadout}
        width="100%"
        onValueChange={setSelectedLoadout}
      />
    </TitledCard>
  );
}
