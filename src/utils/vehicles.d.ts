import type { VehiclesPlaceDataVehicleModule } from '@generated/vehicles';

export type VehicleModuleFromType<
  T extends VehiclesPlaceDataVehicleModule['type'],
> = Extract<VehiclesPlaceDataVehicleModule, { type: T }>;

export type VehicleModuleWithId<
  T extends VehiclesPlaceDataVehicleModule['type'],
> = VehicleModuleFromType<T> & { id: string };
