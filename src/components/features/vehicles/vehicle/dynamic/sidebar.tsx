import React from 'react';

import VehicleDynamicAddons from '@/components/features/vehicles/vehicle/dynamic/addons';
import VehicleDynamicLoadouts from '@/components/features/vehicles/vehicle/dynamic/loadouts';
import { useVehicle } from '@/hooks/providers/vehicle';

export default function VehicleDynamicSidebar() {
  const vehicle = useVehicle();

  return (
    <>
      {Object.keys(vehicle.alterations.loadouts).length > 0 && (
        <VehicleDynamicLoadouts />
      )}

      {Object.keys(vehicle.alterations.addons).length > 0 && (
        <VehicleDynamicAddons />
      )}
    </>
  );
}
