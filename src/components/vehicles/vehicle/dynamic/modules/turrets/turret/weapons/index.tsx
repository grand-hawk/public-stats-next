import { Stack } from '@chakra-ui/react';
import React from 'react';

import Weapon from '@/components/vehicles/vehicle/dynamic/modules/turrets/turret/weapons/weapon';
import TitledCard from '@/components/wiki/titledCard';

import type { TurretWithName } from '@/components/vehicles/vehicle/dynamic/modules/turrets';
import type { VehicleModuleWithId } from '@/utils/vehicles';

export default function Weapons({
  turret,
  weapons,
}: {
  turret: TurretWithName;
  weapons: VehicleModuleWithId<'Weapon'>[];
}) {
  if (weapons.length === 0) return null;
  return (
    <TitledCard
      as="section"
      backgroundColor="bg.muted"
      collapsible
      innerPadding={2}
      title="Weapons"
      withAnchor={`${turret.name}-weapons`}
      headingAs="h3"
    >
      <Stack gap={4}>
        {weapons.map((weapon) => (
          <Weapon
            key={weapon.data.name}
            turretName={turret.name}
            weapon={weapon}
          />
        ))}
      </Stack>
    </TitledCard>
  );
}
