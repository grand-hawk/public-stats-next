import { Box, Center, Span, Stack } from '@chakra-ui/react';
import React from 'react';

import { ContextCapturer } from '@/components/development/contextCapturer';
import VehicleDynamicAddons from '@/components/vehicles/vehicle/dynamic/addons';
import VehicleDynamicLoadouts from '@/components/vehicles/vehicle/dynamic/loadouts';
import VehicleDynamicModules from '@/components/vehicles/vehicle/dynamic/modules';
import { DynamicDataContext } from '@/hooks/providers/dynamicData';
import { useVehicle } from '@/hooks/providers/vehicle';
import { assembleModules } from '@/utils/alterations';

export default function VehicleDynamicData() {
  const vehicle = useVehicle();

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
    return assembleModules(vehicle, enabledAlterations);
  }, [vehicle, enabledAlterations]);

  // Reset states when vehicle changes
  React.useEffect(() => {
    if (selectedLoadout !== null) setSelectedLoadout(null);
    if (Object.keys(enabledAddons).length > 0) setEnabledAddons({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle.info.slug]);

  const hasAlterations =
    Object.keys(vehicle.alterations.addons).length > 0 ||
    Object.keys(vehicle.alterations.loadouts).length > 0;

  const contextValue = React.useMemo(
    () => ({ assembledModules, enabledAlterations }),
    [assembledModules, enabledAlterations],
  );

  return (
    <Box
      display="grid"
      gap={{
        base: hasAlterations ? 4 : 0,
        xl: 4,
      }}
      gridTemplateColumns={{
        base: '1fr',
        xl: '1fr var(--chakra-sizes-xs)',
      }}
      width="100%"
    >
      <DynamicDataContext.Provider value={contextValue}>
        <ContextCapturer contextKey="DynamicData" data={contextValue} />
        <Stack
          gap={4}
          gridColumn={{ base: 'unset', xl: '2' }}
          gridRow={{ base: 'unset', xl: '1' }}
          maxHeight="max-content"
          position={{ base: 'unset', xl: 'sticky' }}
          top={4}
        >
          {Object.keys(vehicle.alterations.loadouts).length > 0 && (
            <VehicleDynamicLoadouts
              selectedLoadout={selectedLoadout}
              setSelectedLoadout={setSelectedLoadout}
            />
          )}

          {Object.keys(vehicle.alterations.addons).length > 0 && (
            <VehicleDynamicAddons
              selectedLoadout={selectedLoadout}
              setEnabledAddons={setEnabledAddons}
            />
          )}

          <Center hideBelow="xl" paddingX={4} data-md-ignore>
            <Span
              color="fg.subtle"
              fontSize="xs"
              suppressHydrationWarning
              title={new Date(vehicle.info.lastRetrieved).toLocaleString()}
            >
              Data as of{' '}
              {new Date(vehicle.info.lastRetrieved).toLocaleDateString()}
            </Span>
          </Center>
        </Stack>

        <Stack gap={4}>
          <VehicleDynamicModules />
        </Stack>
      </DynamicDataContext.Provider>
    </Box>
  );
}
