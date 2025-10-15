import React from 'react';

import { EmptyState } from '@/components/ui/empty-state';
import Defenses from '@/components/vehicles/vehicle/dynamic/modules/defenses';
import Vehicle from '@/components/vehicles/vehicle/dynamic/modules/vehicle';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type { getAllModulesOfType } from '@/utils/alterations';

export interface DynamicModuleProps {
  vehicle: DetailedVehicle;
  modules: ReturnType<typeof getAllModulesOfType>;
  enabledAlterations: Record<string, boolean>;
}

export default function VehicleDynamicModules({
  enabledAlterations,
  modules,
  vehicle,
}: DynamicModuleProps) {
  if (modules.length === 0)
    return <EmptyState title="No modules available for this vehicle" />;

  const data = {
    vehicle,
    modules,
    enabledAlterations,
  };

  return (
    <>
      <Vehicle data={data} />
      <Defenses data={data} />
    </>
  );
}
