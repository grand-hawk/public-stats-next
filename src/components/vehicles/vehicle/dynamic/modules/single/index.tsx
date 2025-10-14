import DriveData from '@/components/vehicles/vehicle/dynamic/modules/single/driveData';
import { getOneModuleOfType } from '@/utils/alterations';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type { VehiclesPlaceDataVehicleModule } from '@generated/vehicles';
import type React from 'react';

export interface SingleModuleProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends VehiclesPlaceDataVehicleModule['type'] = any,
> {
  module: Extract<VehiclesPlaceDataVehicleModule, { type: T }>;
}

export const singleModules: Partial<
  Record<
    VehiclesPlaceDataVehicleModule['type'],
    (props: SingleModuleProps) => React.ReactNode
  >
> = {
  DriveData,
};

export default function SingleModule({
  data,
  moduleType,
}: {
  moduleType: VehiclesPlaceDataVehicleModule['type'];
  data: {
    vehicle: DetailedVehicle;
    enabledAlterations: Record<string, boolean>;
  };
}) {
  const foundModule = getOneModuleOfType(
    moduleType,
    data.vehicle,
    data.enabledAlterations,
  );
  if (!foundModule) return null;

  const Component = singleModules[moduleType as keyof typeof singleModules]!;
  return <Component module={foundModule} />;
}
