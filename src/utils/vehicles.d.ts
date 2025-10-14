import type { VehiclesPlaceDataVehicleModule } from '@generated/vehicles';

export type VehicleModuleFromType<
  T extends VehiclesPlaceDataVehicleModule['type'],
> = Extract<VehiclesPlaceDataVehicleModule, { type: T }>;
