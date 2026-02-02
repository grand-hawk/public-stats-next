import { Center, Span } from '@chakra-ui/react';
import React from 'react';

import VehicleDynamicAddons from '@/components/vehicles/vehicle/dynamic/addons';
import VehicleDynamicLoadouts from '@/components/vehicles/vehicle/dynamic/loadouts';
import { useVehicle } from '@/hooks/providers/vehicle';

export default function VehicleDynamicSidebar() {
  const vehicle = useVehicle();

  const lastRetrievedDate = new Date(
    vehicle.info.lastRetrieved,
  ).toLocaleDateString();

  return (
    <>
      {Object.keys(vehicle.alterations.loadouts).length > 0 && (
        <VehicleDynamicLoadouts />
      )}

      {Object.keys(vehicle.alterations.addons).length > 0 && (
        <VehicleDynamicAddons />
      )}

      <Center hideBelow="xl" paddingX={4} data-md-ignore>
        <Span
          color="fg.subtle"
          fontSize="xs"
          suppressHydrationWarning
          title={lastRetrievedDate}
        >
          Data as of {lastRetrievedDate}
        </Span>
      </Center>
    </>
  );
}
