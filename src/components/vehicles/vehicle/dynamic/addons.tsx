import { Checkbox, FormatNumber, HStack, Span, Stack } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineCheck } from 'react-icons/md';

import InfoTooltip from '@/components/infoTooltip';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { useVehicle } from '@/hooks/providers/vehicle';
import {
  alterationHasChanges,
  alterationIsConflicting,
} from '@/utils/alterations';

export default function VehicleDynamicAddons() {
  const vehicle = useVehicle();
  const { enabledAlterations, selectedLoadout, setEnabledAddons } =
    useDynamicData();

  const setAddonsEnabled = React.useCallback(
    (addons: Array<[addonName: string, enabled: boolean]>) => {
      setEnabledAddons((prev) => {
        const newState = { ...prev };

        for (const [addonName, enabled] of addons) {
          if (enabled) newState[addonName] = true;
          else delete newState[addonName];
        }

        return newState;
      });
    },
    [setEnabledAddons],
  );

  const enabledCategories = React.useMemo(() => {
    const categories = new Set<string>();

    for (const [alteration] of Object.entries(enabledAlterations).filter(
      ([_, enabled]) => enabled,
    )) {
      const loadout = vehicle.alterations.loadouts[alteration];
      if (loadout) {
        if (loadout.category) categories.add(loadout.category);
        continue;
      }

      const addon = vehicle.alterations.addons[alteration];
      if (addon) {
        if (addon.category) categories.add(addon.category);
        continue;
      }
    }

    return Object.fromEntries(
      Array.from(categories).map((category) => [category, true]),
    );
  }, [
    enabledAlterations,
    vehicle.alterations.addons,
    vehicle.alterations.loadouts,
  ]);

  // Scan and remove incompatible addons
  React.useEffect(() => {
    const conflicting: string[] = [];

    for (const alterationName of Object.keys(enabledAlterations)) {
      const addon = vehicle.alterations.addons[alterationName];
      if (!addon) continue;

      if (
        alterationIsConflicting(
          addon,
          vehicle.alterations.addons,
          enabledAlterations,
          selectedLoadout,
        )
      )
        conflicting.push(alterationName);
    }

    if (conflicting.length > 0)
      setAddonsEnabled(
        conflicting.map((alterationName) => [alterationName, false]),
      );
  }, [
    vehicle.alterations.addons,
    selectedLoadout,
    enabledAlterations,
    enabledCategories,
    setAddonsEnabled,
  ]);

  const sortedAddons = React.useMemo(() => {
    return Object.entries(vehicle.alterations.addons).sort((a, b) => {
      const aHasChanges = alterationHasChanges(a[1]);
      const bHasChanges = alterationHasChanges(b[1]);

      if (aHasChanges && !bHasChanges) return -1;
      if (!aHasChanges && bHasChanges) return 1;
      return a[0].localeCompare(b[0]);
    });
  }, [vehicle.alterations.addons]);

  return (
    <TitledCard as="section" title="Addons" innerPadding={4}>
      <Stack gap={4} data-md-ignore>
        {sortedAddons.map(([addonName, addon]) => {
          const hasChanges = alterationHasChanges(addon);
          const isEnabled = !!enabledAlterations[addonName];
          const isConflicting = alterationIsConflicting(
            addon,
            vehicle.alterations.addons,
            enabledAlterations,
            selectedLoadout,
          );
          const isDisabled = !isEnabled && isConflicting;

          const formattedAddonName = addonName
            .replace(/\(cosmetic\)$/i, '')
            .trim();

          return (
            <Stack key={addonName} gap={1.5}>
              {hasChanges ? (
                <Checkbox.Root
                  checked={isEnabled}
                  disabled={isDisabled}
                  onCheckedChange={(details) =>
                    setAddonsEnabled([[addonName, !!details.checked]])
                  }
                >
                  <Checkbox.HiddenInput />

                  <Checkbox.Control borderRadius="none">
                    {isEnabled && <MdOutlineCheck />}
                  </Checkbox.Control>

                  <Checkbox.Label overflowWrap="anywhere" userSelect="unset">
                    {formattedAddonName}
                  </Checkbox.Label>
                </Checkbox.Root>
              ) : (
                <HStack gap={2.5} opacity={isDisabled ? 0.5 : undefined}>
                  <InfoTooltip
                    content="This addon does not change any of the data visible on this page"
                    iconProps={{ color: 'border.emphasized' }}
                  />

                  <Span
                    fontSize="sm"
                    fontWeight="medium"
                    lineHeight="1.25rem"
                    overflowWrap="anywhere"
                  >
                    {formattedAddonName}
                  </Span>
                </HStack>
              )}

              <Span
                color={isDisabled ? 'fg.muted' : undefined}
                fontSize="sm"
                lineHeight="1.25rem"
              >
                {addon.cost !== undefined ? (
                  <>
                    <FormatNumber value={addon.cost} /> points
                  </>
                ) : (
                  'Free'
                )}
              </Span>
            </Stack>
          );
        })}
      </Stack>

      <table data-md-show style={{ display: 'none' }}>
        <thead>
          <tr>
            <th>Addon</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {sortedAddons.map(([addonName, addon]) => (
            <tr key={addonName}>
              <td>{addonName.trim()}</td>
              <td>
                {addon.cost !== undefined ? (
                  <>
                    <FormatNumber value={addon.cost} /> points
                  </>
                ) : (
                  'Free'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TitledCard>
  );
}
