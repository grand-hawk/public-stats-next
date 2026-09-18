import { Portal, Select, createListCollection } from '@chakra-ui/react';
import React from 'react';

import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type { SystemStyleObject } from '@chakra-ui/react';

const NO_LOADOUT = '<none>';

const ROOT_CSS: SystemStyleObject = {
  width: '100%',
  borderColor: 'var(--border-color-interactive)',
  borderRadius: '4px',
  '&:hover': { borderColor: 'var(--border-color-interactive--hover)' },
  '&:focus-within': {
    ...FOCUS_RING_CSS,
    outline: 'none',
    borderColor: 'var(--border-color-progressive--focus)',
  },
};

const TRIGGER_CSS: SystemStyleObject = {
  minHeight: '32px',
  paddingInline: '8px',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  '&:focus-visible': { outline: 'none', boxShadow: 'none' },
};

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
      css={ROOT_CSS}
      size="xs"
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
        <Select.Trigger css={TRIGGER_CSS}>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup paddingInline={2}>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
