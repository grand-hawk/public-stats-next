import { Stack } from '@chakra-ui/react';
import React from 'react';

import Sight from '@/components/features/vehicles/vehicle/dynamic/modules/turrets/turret/sights/sight';
import TitledCard from '@/components/wiki/titledCard';

import type { TurretWithName } from '@/components/features/vehicles/vehicle/dynamic/modules/turrets';

export default function Sights({ turret }: { turret: TurretWithName }) {
  return (
    <TitledCard
      backgroundColor="bg.muted"
      collapsible
      innerPadding={2}
      moduleId={turret.id}
      title="Sights"
      withAnchor={`${turret.name}-sights`}
      headingAs="h3"
    >
      <Stack gap={4}>
        {turret.data.sights.map((sight, index) => (
          <Sight
            key={index}
            moduleId={turret.id}
            sight={sight}
            sightIndex={index}
            turretName={turret.name}
          />
        ))}
      </Stack>
    </TitledCard>
  );
}
