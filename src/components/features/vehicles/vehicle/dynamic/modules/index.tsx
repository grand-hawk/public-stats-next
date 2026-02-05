import React from 'react';

import APS from '@/components/features/vehicles/vehicle/dynamic/modules/aps';
import Defenses from '@/components/features/vehicles/vehicle/dynamic/modules/defenses';
import Turrets from '@/components/features/vehicles/vehicle/dynamic/modules/turrets';
import Vehicle from '@/components/features/vehicles/vehicle/dynamic/modules/vehicle';
import { EmptyState } from '@/components/ui/empty-state';
import { useDynamicData } from '@/hooks/providers/dynamicData';

export default function VehicleDynamicModules() {
  const { assembledModules } = useDynamicData();

  if (Object.keys(assembledModules).length === 0)
    return <EmptyState title="No modules available for this vehicle" />;

  return (
    <>
      <Vehicle />
      <Defenses />
      <APS />
      <Turrets />
    </>
  );
}
