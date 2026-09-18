import { Span } from '@chakra-ui/react';
import React from 'react';

import AlterationCheckbox from '@/components/features/compare/alterationCheckbox';
import { getSelectedLoadout } from '@/components/features/compare/vehicleColumnConfig';
import { alterationIsConflicting } from '@/utils/alterations';

import type { SectionDef } from '@/components/features/compare/types';
import type { AssembledVehicle } from '@/components/features/compare/vehicleStats';

function addonLabel(addonName: string) {
  return addonName.replace(/\(cosmetic\)$/i, '').trim();
}

function addonsCost(item: AssembledVehicle, addonNames: string[]) {
  let total = 0;
  for (const addonName of addonNames) {
    if (!item.enabledAlterations[addonName]) continue;
    const addon = item.vehicle.alterations.addons[addonName];
    if (addon?.cost) total += addon.cost;
  }
  return total;
}

export function buildAddonsSection(
  addonNames: string[],
): SectionDef<AssembledVehicle> {
  return {
    title: 'Addons',
    titleGetter: (item) => {
      const total = addonsCost(item, addonNames);
      if (total === 0) return null;

      return (
        <Span color="fg.muted" fontWeight={400}>
          {total} pts
        </Span>
      );
    },
    stats: addonNames.map((addonName) => ({
      label: addonLabel(addonName),
      getter: (item: AssembledVehicle) => {
        const addon = item.vehicle.alterations.addons[addonName];
        if (!addon) return null;

        const isEnabled = !!item.enabledAlterations[addonName];
        const isConflicting = alterationIsConflicting(
          addon,
          item.vehicle.alterations.addons,
          item.enabledAlterations,
          getSelectedLoadout(item.vehicle, item.enabledAlterations),
          Object.keys(item.vehicle.alterations.loadouts),
        );

        return (
          <AlterationCheckbox
            checked={isEnabled}
            cost={addon.cost ?? 0}
            disabled={!isEnabled && isConflicting}
            label={addonLabel(addonName)}
            onToggle={() => {
              const next = { ...item.enabledAlterations };
              if (isEnabled) delete next[addonName];
              else next[addonName] = true;
              item.onAlterationsChange(next);
            }}
          />
        );
      },
    })),
  };
}
