import React from 'react';

import VehicleAvailability from '@/components/vehicles/vehicle/availability';
import VehicleDynamicData from '@/components/vehicles/vehicle/dynamic';
import VehicleGeneralInformation from '@/components/vehicles/vehicle/generalInformation';
import VehicleHeader from '@/components/vehicles/vehicle/header';
import { VehicleContext } from '@/hooks/providers/vehicle';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function Vehicle({ vehicle }: { vehicle: DetailedVehicle }) {
  const vehicleIsAvailable =
    !!vehicle.info.availability &&
    Object.keys(vehicle.info.availability).length > 0;

  return (
    <VehicleContext.Provider value={vehicle}>
      <VehicleHeader />
      <VehicleGeneralInformation isAvailable={vehicleIsAvailable} />
      <VehicleAvailability
        availability={vehicle.info.availability}
        isAvailable={vehicleIsAvailable}
      />
      <VehicleDynamicData />
    </VehicleContext.Provider>
  );
}
