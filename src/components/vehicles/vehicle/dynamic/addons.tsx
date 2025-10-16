import {
  Checkbox,
  FormatNumber,
  HStack,
  Icon,
  Span,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { MdInfoOutline, MdOutlineCheck } from 'react-icons/md';

import { Tooltip } from '@/components/ui/tooltip';
import TitledCard from '@/components/vehicles/titledCard';
import {
  alterationHasChanges,
  alterationIsConflicting,
} from '@/utils/alterations';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function VehicleDynamicAddons({
  enabledAlterations,
  selectedLoadout,
  setEnabledAddons,
  vehicle,
}: {
  vehicle: DetailedVehicle;
  selectedLoadout: string | null;
  enabledAlterations: Record<string, boolean>;
  setEnabledAddons: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}) {
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

  return (
    <TitledCard title="Addons" withAnchor="addon-config">
      <Stack as="section" gap={4}>
        {Object.entries(vehicle.alterations.addons)
          .sort((a, b) => {
            const aHasChanges = alterationHasChanges(a[1]);
            const bHasChanges = alterationHasChanges(b[1]);

            if (aHasChanges && !bHasChanges) return -1;
            if (!aHasChanges && bHasChanges) return 1;
            return a[0].localeCompare(b[0]);
          })
          .map(([addonName, addon]) => {
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
              <Stack key={addonName}>
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
                    <Tooltip
                      closeDelay={50}
                      content="This addon has no data changes"
                      disabled={isDisabled}
                      lazyMount
                      openDelay={50}
                      positioning={{ placement: 'top' }}
                    >
                      <Icon
                        aria-label="Addon has no data changes"
                        color="border.emphasized"
                        height={5}
                        width={5}
                      >
                        <MdInfoOutline />
                      </Icon>
                    </Tooltip>

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
    </TitledCard>
  );
}
