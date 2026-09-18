import { Portal, Select, createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

const NO_LOADOUT = '<none>';

export function getSelectedLoadout(
  vehicle: DetailedVehicle,
  enabledAlterations: Record<string, boolean>,
): string | null {
  for (const name of Object.keys(vehicle.alterations.loadouts)) {
    if (enabledAlterations[name]) return name;
  }
  return null;
}

export default function VehicleColumnConfig({
  enabledAlterations,
  onAlterationsChange,
  vehicle,
}: {
  enabledAlterations: Record<string, boolean>;
  vehicle: DetailedVehicle;
  onAlterationsChange: (alterations: Record<string, boolean>) => void;
}) {
  const loadouts = vehicle.alterations.loadouts;
  const loadoutNames = Object.keys(loadouts);

  const collection = createListCollection({
    items: [
      { label: 'No loadout', value: NO_LOADOUT },
      ...loadoutNames.map((name) => ({ label: name, value: name })),
    ],
  });

  if (loadoutNames.length === 0) return null;

  const selected = getSelectedLoadout(vehicle, enabledAlterations);

  return (
    <Select.Root
      lazyMount
      aria-label={`Loadout for ${vehicle.info.name}`}
      collection={collection}
      size="xs"
      width="100%"
      value={selected ? [selected] : [NO_LOADOUT]}
      onValueChange={(details) => {
        const value = details.value[0];
        const next: Record<string, boolean> = {};
        if (value !== NO_LOADOUT) next[value] = true;
        for (const [name, enabled] of Object.entries(enabledAlterations)) {
          if (name in loadouts) continue;
          if (enabled) next[name] = true;
        }
        onAlterationsChange(next);
      }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
