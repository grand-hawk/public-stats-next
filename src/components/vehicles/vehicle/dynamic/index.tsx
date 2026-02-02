import React from 'react';

import { ContextCapturer } from '@/components/development/contextCapturer';
import VehicleDynamicModules from '@/components/vehicles/vehicle/dynamic/modules';
import { useDynamicData } from '@/hooks/providers/dynamicData';

export default function VehicleDynamicData() {
  const contextValue = useDynamicData();

  return (
    <>
      <ContextCapturer contextKey="DynamicData" data={contextValue} />

      <VehicleDynamicModules />
    </>
  );
}
