import { createListCollection, Portal, Select } from '@chakra-ui/react';
import React from 'react';

import TitledCard from '@/components/vehicles/titledCard';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function VehicleDynamicLoadouts({
  selectedLoadout,
  setSelectedLoadout,
  vehicle,
}: {
  vehicle: DetailedVehicle;
  selectedLoadout: string | null;
  setSelectedLoadout: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const loadoutCollection = createListCollection({
    items: [
      {
        value: '<none>',
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
      tooltip="Select version of the vehicle in a certain gamemode"
      withAnchor="loadout-config"
    >
      <Select.Root
        borderWidth="1px"
        collection={loadoutCollection}
        lazyMount
        size="sm"
        value={selectedLoadout === null ? ['<none>'] : [selectedLoadout]}
        width="100%"
        onValueChange={(details) =>
          setSelectedLoadout(
            details.value[0] === '<none>' ? null : details.value[0],
          )
        }
      >
        <Select.HiddenSelect />

        <Select.Control padding={2}>
          <Select.Trigger
            border="none"
            borderRadius="none"
            minHeight="unset"
            paddingInline="unset"
          >
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup paddingInline={4}>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content borderRadius="none">
              {loadoutCollection.items.map((item) => (
                <Select.Item key={item.label} borderRadius="none" item={item}>
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
