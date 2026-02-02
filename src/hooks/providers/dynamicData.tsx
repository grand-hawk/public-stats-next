import React from 'react';

import { useVehicle } from '@/hooks/providers/vehicle';
import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { assembleModules } from '@/utils/alterations';

export interface DynamicDataContext {
  assembledModules: ReturnType<typeof assembleModules>;
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

  const assembledModules = React.useMemo(() => {
    return assembleModules(vehicle, enabledAlterations, debug);
  }, [vehicle, enabledAlterations, debug]);

  // Reset states when vehicle changes
  React.useEffect(() => {
    if (selectedLoadout !== null) setSelectedLoadout(null);
    if (Object.keys(enabledAddons).length > 0) setEnabledAddons({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle.info.slug]);

  const contextValue = React.useMemo(
    () => ({
      assembledModules,
      enabledAlterations,
      selectedLoadout,
      setSelectedLoadout,
      setEnabledAddons,
    }),
    [assembledModules, enabledAlterations, selectedLoadout],
  );

  return (
    <DynamicDataContext.Provider value={contextValue}>
      {children}
    </DynamicDataContext.Provider>
  );
}
