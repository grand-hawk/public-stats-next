import React from 'react';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export type VehicleContext = DetailedVehicle;

export const VehicleContext = React.createContext<VehicleContext>(
  {} as VehicleContext,
);

export function useVehicle() {
  return React.useContext(VehicleContext);
}
