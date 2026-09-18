import { Stack } from '@chakra-ui/react';
import React from 'react';

import AddonRow, {
  addonCost,
} from '@/components/features/vehicles/vehicle/dynamic/addons/row';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
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

  const definedLoadouts = React.useMemo(
    () => Object.keys(vehicle.alterations.loadouts),
    [vehicle.alterations.loadouts],
  );

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
          definedLoadouts,
        )
      ) {
        conflicting.push(alterationName);
      }
    }

    if (conflicting.length > 0) {
      setAddonsEnabled(
        conflicting.map((alterationName) => [alterationName, false]),
      );
    }
  }, [
    vehicle.alterations.addons,
    selectedLoadout,
    enabledAlterations,
    definedLoadouts,
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
    <TitledCard as="section" title="Addons">
      <Stack gap={4} padding={4} css={RAISED_FRAME_CSS} data-md-ignore>
        {sortedAddons.map(([addonName, addon]) => {
          const isEnabled = !!enabledAlterations[addonName];
          const isConflicting = alterationIsConflicting(
            addon,
            vehicle.alterations.addons,
            enabledAlterations,
            selectedLoadout,
            definedLoadouts,
          );

          return (
            <AddonRow
              key={addonName}
              addon={addon}
              hasChanges={alterationHasChanges(addon)}
              isDisabled={!isEnabled && isConflicting}
              isEnabled={isEnabled}
              name={addonName.replace(/\(cosmetic\)$/i, '').trim()}
              onToggle={(enabled) => setAddonsEnabled([[addonName, enabled]])}
            />
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
              <td>{addonCost(addon)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TitledCard>
  );
}
