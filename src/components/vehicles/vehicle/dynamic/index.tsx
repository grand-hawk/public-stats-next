import { Box, Stack } from '@chakra-ui/react';
import React from 'react';

import VehicleDynamicAddons from '@/components/vehicles/vehicle/dynamic/addons';
import VehicleDynamicLoadouts from '@/components/vehicles/vehicle/dynamic/loadouts';
import VehicleDynamicModules from '@/components/vehicles/vehicle/dynamic/modules';
import { assembleModules } from '@/utils/alterations';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function VehicleDynamicData({
  vehicle,
}: {
  vehicle: DetailedVehicle;
}) {
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
    setSelectedLoadout(null);
    setEnabledAddons({});
  }, [vehicle.info.slug]);

  const hasAlterations =
    Object.keys(vehicle.alterations.addons).length > 0 ||
    Object.keys(vehicle.alterations.loadouts).length > 0;

  const vehicleDynamicModules = (
    <VehicleDynamicModules
      enabledAlterations={enabledAlterations}
      modules={assembledModules}
      vehicle={vehicle}
    />
  );

  return hasAlterations ? (
    <Box
      display="grid"
      gap={4}
      gridTemplateColumns={{
        base: '1fr',
        xl: '1fr var(--chakra-sizes-xs)',
      }}
      id="with-alterations"
      width="100%"
    >
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
            vehicle={vehicle}
          />
        )}

        {Object.keys(vehicle.alterations.addons).length > 0 && (
          <VehicleDynamicAddons
            enabledAlterations={enabledAlterations}
            selectedLoadout={selectedLoadout}
            setEnabledAddons={setEnabledAddons}
            vehicle={vehicle}
          />
        )}
      </Stack>

      <Stack gap={4}>{vehicleDynamicModules}</Stack>
    </Box>
  ) : (
    vehicleDynamicModules
  );
}
