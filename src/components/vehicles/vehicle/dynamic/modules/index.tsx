import React from 'react';

import { EmptyState } from '@/components/ui/empty-state';
import Defenses from '@/components/vehicles/vehicle/dynamic/modules/custom/defenses';
import SingleModule from '@/components/vehicles/vehicle/dynamic/modules/single';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type { assembleModules } from '@/utils/alterations';

export interface DynamicModuleProps {
  vehicle: DetailedVehicle;
  modules: ReturnType<typeof assembleModules>;
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
      <SingleModule data={data} moduleType="DriveData" />
      <Defenses data={data} />
    </>
  );
}
