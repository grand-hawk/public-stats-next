import React from 'react';

import Turrets from '@/components/features/vehicles/vehicle/dynamic/modules/turrets';
import { DynamicDataContext } from '@/hooks/providers/dynamicData';
import { usePlaceable } from '@/hooks/providers/placeable';

import type { ModulesDictionary } from '@/utils/alterations';

const EMPTY = new Set<string>();

export default function PlaceableTurrets() {
  const placeable = usePlaceable();

  const value = React.useMemo(
    () => ({
      addedModuleIds: EMPTY,
      assembledModules: (placeable.modules ?? {}) as ModulesDictionary,
      enabledAlterations: {},
      hasRemovedChildrenIds: EMPTY,
      removedModuleIds: EMPTY,
      selectedLoadout: null,
      setEnabledAddons: () => {},
      setSelectedLoadout: () => {},
    }),
    [placeable.modules],
  );

  if (!placeable.modules) return null;

  return (
    <DynamicDataContext.Provider value={value}>
      <Turrets />
    </DynamicDataContext.Provider>
  );
}
