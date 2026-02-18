import React from 'react';

import { useVehicle } from '@/hooks/providers/vehicle';
import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { assembleModules } from '@/utils/alterations';

export interface DynamicDataContext {
  assembledModules: ReturnType<typeof assembleModules>;
  addedModuleIds: Set<string>;
  removedModuleIds: Set<string>;
  hasRemovedChildrenIds: Set<string>;
  enabledAlterations: Record<string, boolean>;
  selectedLoadout: string | null;
  setSelectedLoadout: (loadout: string | null) => void;
  setEnabledAddons: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export const DynamicDataContext = React.createContext<DynamicDataContext>(
  {} as DynamicDataContext,
);

export function useDynamicData() {
  return React.useContext(DynamicDataContext);
}

function findRefs(obj: unknown): Set<string> {
  const refs = new Set<string>();
  const search = (val: unknown) => {
    if (typeof val === 'string') refs.add(val);
    else if (Array.isArray(val)) val.forEach(search);
    else if (val && typeof val === 'object') Object.values(val).forEach(search);
  };
  search(obj);
  return refs;
}

function getChangedModuleIds(
  baseModules: ReturnType<typeof assembleModules>,
  currentModules: ReturnType<typeof assembleModules>,
): {
  added: Set<string>;
  removed: Set<string>;
  hasRemovedChildren: Set<string>;
} {
  const added = new Set<string>();
  const removed = new Set<string>();
  const hasRemovedChildren = new Set<string>();

  const baseKeys = new Set(
    Object.keys(baseModules).filter((k) => k !== '$debug'),
  );
  const currentKeys = new Set(
    Object.keys(currentModules).filter((k) => k !== '$debug'),
  );

  for (const key of currentKeys) {
    if (!baseKeys.has(key)) added.add(key);
  }

  for (const key of baseKeys) {
    if (!currentKeys.has(key)) removed.add(key);
  }

  for (const key of currentKeys) {
    if (baseKeys.has(key) && !added.has(key)) {
      const baseData = JSON.stringify(baseModules[key]);
      const currentData = JSON.stringify(currentModules[key]);
      if (baseData !== currentData) {
        const baseRefs = findRefs(baseModules[key]);
        const currentRefs = findRefs(currentModules[key]);
        const lostRefs = [...baseRefs].filter(
          (ref) => !currentRefs.has(ref) && removed.has(ref),
        );

        if (lostRefs.length > 0) hasRemovedChildren.add(key);
        else added.add(key);
      }
    }
  }

  for (const key of currentKeys) {
    if (added.has(key) || hasRemovedChildren.has(key)) continue;

    const refs = findRefs(currentModules[key]);
    const hasAddedChild = [...refs].some((ref) => added.has(ref));
    const hasRemovedChild = [...refs].some(
      (ref) => removed.has(ref) || hasRemovedChildren.has(ref),
    );

    if (hasAddedChild) added.add(key);
    else if (hasRemovedChild) hasRemovedChildren.add(key);
  }

  return { added, removed, hasRemovedChildren };
}

export function DynamicDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const vehicle = useVehicle();
  const debug = useDebugEnabled();

  const [selectedLoadout, setSelectedLoadout] = React.useState<string | null>(
    null,
  );
  const [enabledAddons, setEnabledAddons] = React.useState<
    Record<string, boolean>
  >({});

  const enabledAlterations = React.useMemo(() => {
    if (selectedLoadout) return { [selectedLoadout]: true, ...enabledAddons };
    return enabledAddons;
  }, [selectedLoadout, enabledAddons]);

  const baseModules = React.useMemo(() => {
    return assembleModules(vehicle, {}, debug);
  }, [vehicle, debug]);

  const assembledModules = React.useMemo(() => {
    return assembleModules(vehicle, enabledAlterations, debug);
  }, [vehicle, enabledAlterations, debug]);

  const {
    added: addedModuleIds,
    hasRemovedChildren: hasRemovedChildrenIds,
    removed: removedModuleIds,
  } = React.useMemo(() => {
    return getChangedModuleIds(baseModules, assembledModules);
  }, [baseModules, assembledModules]);

  const prevAddedIdsRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    const newIds = [...addedModuleIds].filter(
      (id) => !prevAddedIdsRef.current.has(id),
    );

    if (newIds.length > 0) {
      requestAnimationFrame(() => {
        const firstHighlighted = document.querySelector(
          '[data-module-highlighted]',
        );
        if (firstHighlighted) {
          firstHighlighted.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    }

    prevAddedIdsRef.current = addedModuleIds;
  }, [addedModuleIds]);

  React.useLayoutEffect(() => {
    setSelectedLoadout(null);
    setEnabledAddons({});
    prevAddedIdsRef.current = new Set();
  }, [vehicle.info.slug]);

  const contextValue = React.useMemo(
    () => ({
      assembledModules,
      addedModuleIds,
      removedModuleIds,
      hasRemovedChildrenIds,
      enabledAlterations,
      selectedLoadout,
      setSelectedLoadout,
      setEnabledAddons,
    }),
    [
      assembledModules,
      addedModuleIds,
      removedModuleIds,
      hasRemovedChildrenIds,
      enabledAlterations,
      selectedLoadout,
    ],
  );

  return (
    <DynamicDataContext.Provider value={contextValue}>
      {children}
    </DynamicDataContext.Provider>
  );
}
