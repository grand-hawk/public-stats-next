import {
  Checkbox,
  createListCollection,
  Flex,
  Portal,
  Select,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { LuSettings2 } from 'react-icons/lu';
import { MdOutlineCheck } from 'react-icons/md';

import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  alterationHasChanges,
  alterationIsConflicting,
} from '@/utils/alterations';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

const NO_VALUE = '<none>';

export interface VehicleColumnConfigProps {
  vehicle: DetailedVehicle;
  enabledAlterations: Record<string, boolean>;
  onAlterationsChange: (alterations: Record<string, boolean>) => void;
}

export default function VehicleColumnConfig({
  enabledAlterations,
  onAlterationsChange,
  vehicle,
}: VehicleColumnConfigProps) {
  const loadouts = vehicle.alterations.loadouts;
  const addons = vehicle.alterations.addons;
  const hasLoadouts = Object.keys(loadouts).length > 0;
  const hasAddons = Object.keys(addons).length > 0;

  const selectedLoadout = React.useMemo(() => {
    for (const name of Object.keys(loadouts)) {
      if (enabledAlterations[name]) return name;
    }
    return null;
  }, [enabledAlterations, loadouts]);

  const loadoutCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { value: NO_VALUE, label: 'None' },
          ...Object.keys(loadouts).map((name) => ({
            value: name,
            label: name,
          })),
        ],
      }),
    [loadouts],
  );

  const handleLoadoutChange = React.useCallback(
    (value: string) => {
      const next: Record<string, boolean> = {};

      if (value !== NO_VALUE) next[value] = true;

      for (const [name, enabled] of Object.entries(enabledAlterations)) {
        if (name in loadouts) continue;
        if (enabled) next[name] = true;
      }

      onAlterationsChange(next);
    },
    [enabledAlterations, loadouts, onAlterationsChange],
  );

  const handleAddonToggle = React.useCallback(
    (addonName: string, checked: boolean) => {
      const next = { ...enabledAlterations };
      if (checked) next[addonName] = true;
      else delete next[addonName];
      onAlterationsChange(next);
    },
    [enabledAlterations, onAlterationsChange],
  );

  const sortedAddons = React.useMemo(() => {
    return Object.entries(addons).sort((a, b) => {
      const aHas = alterationHasChanges(a[1]);
      const bHas = alterationHasChanges(b[1]);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return a[0].localeCompare(b[0]);
    });
  }, [addons]);

  if (!hasLoadouts && !hasAddons) return null;

  const hasActiveAlterations = Object.values(enabledAlterations).some(Boolean);

  return (
    <PopoverRoot
      lazyMount
      positioning={{ placement: 'bottom-end' }}
      unmountOnExit
    >
      <PopoverTrigger asChild>
        <Flex
          _hover={{ color: 'fg', background: 'whiteAlpha.200' }}
          alignItems="center"
          as="button"
          color={hasActiveAlterations ? 'fg' : 'fg.muted'}
          cursor="pointer"
          flexShrink={0}
          justifyContent="center"
          padding={0.5}
        >
          <LuSettings2 size={14} />
        </Flex>
      </PopoverTrigger>

      <PopoverContent
        borderRadius="0"
        maxHeight="360px"
        overflowY="auto"
        width="240px"
      >
        <PopoverBody padding={3}>
          <Stack gap={2}>
            {hasLoadouts && (
              <Stack gap={1.5}>
                <Text color="fg.muted" fontSize="xs" fontWeight="semibold">
                  Loadout
                </Text>
                <Select.Root
                  collection={loadoutCollection}
                  lazyMount
                  size="xs"
                  value={selectedLoadout ? [selectedLoadout] : [NO_VALUE]}
                  width="100%"
                  onValueChange={(details) =>
                    handleLoadoutChange(details.value[0])
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
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Stack>
            )}

            {hasAddons && (
              <Stack gap={1.5}>
                <Text color="fg.muted" fontSize="xs" fontWeight="semibold">
                  Addons
                </Text>
                {sortedAddons.map(([addonName, addon]) => {
                  const hasChanges = alterationHasChanges(addon);
                  if (!hasChanges) return null;

                  const isEnabled = !!enabledAlterations[addonName];
                  const isConflicting = alterationIsConflicting(
                    addon,
                    addons,
                    enabledAlterations,
                    selectedLoadout,
                  );
                  const isDisabled = !isEnabled && isConflicting;

                  const label = addonName.replace(/\(cosmetic\)$/i, '').trim();

                  return (
                    <Checkbox.Root
                      key={addonName}
                      checked={isEnabled}
                      disabled={isDisabled}
                      size="sm"
                      onCheckedChange={(details) =>
                        handleAddonToggle(addonName, !!details.checked)
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control borderRadius="none">
                        {isEnabled && <MdOutlineCheck />}
                      </Checkbox.Control>
                      <Checkbox.Label>
                        <Span fontSize="xs">{label}</Span>
                      </Checkbox.Label>
                    </Checkbox.Root>
                  );
                })}
              </Stack>
            )}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
