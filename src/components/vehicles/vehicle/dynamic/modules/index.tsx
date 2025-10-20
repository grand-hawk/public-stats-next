import React from 'react';

import { EmptyState } from '@/components/ui/empty-state';
import Defenses from '@/components/vehicles/vehicle/dynamic/modules/defenses';
import Turrets from '@/components/vehicles/vehicle/dynamic/modules/turrets';
import Vehicle from '@/components/vehicles/vehicle/dynamic/modules/vehicle';
import { useDynamicData } from '@/hooks/contexts/dynamicData';

export default function VehicleDynamicModules() {
  const { assembledModules } = useDynamicData();

  if (Object.keys(assembledModules).length === 0)
    return <EmptyState title="No modules available for this vehicle" />;

  return (
    <>
      <Vehicle />
      <Defenses />
      <Turrets />
    </>
  );
}
