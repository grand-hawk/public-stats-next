import { Stack } from '@chakra-ui/react';
import React from 'react';

import Sight from '@/components/vehicles/vehicle/dynamic/modules/turrets/turret/sights/sight';
import TitledCard from '@/components/wikiComponents/titledCard';

import type { TurretWithName } from '@/components/vehicles/vehicle/dynamic/modules/turrets';

export default function Sights({ turret }: { turret: TurretWithName }) {
  return (
    <TitledCard
      backgroundColor="bg.muted"
      collapsible
      innerPadding={2}
      title="Sights"
      withAnchor={`${turret.name}-sights`}
    >
      <Stack gap={4}>
        {turret.data.sights.map((sight, index) => (
          <Sight
            key={index}
            sight={sight}
            sightIndex={index}
            turretName={turret.name}
          />
        ))}
      </Stack>
    </TitledCard>
  );
}
