import { createListCollection, Portal, Select } from '@chakra-ui/react';
import React from 'react';

import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { useVehicle } from '@/hooks/providers/vehicle';

const NO_VALUE = '<none>';

export default function VehicleDynamicLoadouts() {
  const vehicle = useVehicle();
  const { selectedLoadout, setSelectedLoadout } = useDynamicData();

  const loadoutCollection = createListCollection({
    items: [
      {
        value: NO_VALUE,
        label: 'None',
      },
      ...Object.keys(vehicle.alterations.loadouts).map((loadout) => ({
        value: loadout,
        label: loadout,
      })),
    ],
  });

  return (
    <TitledCard
      innerPadding={4}
      title="Loadout"
      tooltip="Select version of the vehicle in a certain loadout"
      withAnchor="loadout-config"
    >
      <Select.Root
        collection={loadoutCollection}
        lazyMount
        size="sm"
        value={selectedLoadout === null ? [NO_VALUE] : [selectedLoadout]}
        width="100%"
        onValueChange={(details) =>
          setSelectedLoadout(
            details.value[0] === NO_VALUE ? null : details.value[0],
          )
        }
      >
        <Select.HiddenSelect />

        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup paddingInline={2}>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content>
              {loadoutCollection.items.map((item) => (
                <Select.Item key={item.label} item={item}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </TitledCard>
  );
}
