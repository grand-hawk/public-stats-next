import { Flex, FormatNumber, Stack } from '@chakra-ui/react';
import React from 'react';

import Sights from '@/components/vehicles/vehicle/dynamic/modules/turrets/turret/sights';
import Weapons from '@/components/vehicles/vehicle/dynamic/modules/turrets/turret/weapons';
import VehicleFeature from '@/components/vehicles/vehicle/feature';
import StatsTable from '@/components/wikiComponents/statsTables';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useDynamicData } from '@/hooks/contexts/dynamicData';
import { getModulesByReferences } from '@/utils/alterations';

import type { TurretWithName } from '@/components/vehicles/vehicle/dynamic/modules/turrets';
import type { Row, Table } from '@/components/wikiComponents/statsTables';

export default function Turret({ turret }: { turret: TurretWithName }) {
  const { assembledModules } = useDynamicData();

  const weapons = getModulesByReferences<'Weapon'>(
    turret.data.weapons,
    assembledModules,
  );

  const features = [
    turret.data.lws && (
      <VehicleFeature key="lws" description="Laser warning system" name="LWS" />
    ),
    turret.data.maws && (
      <VehicleFeature
        key="maws"
        description="Missile approach warning system"
        name="MAWS"
      />
    ),
    turret.data.stabilizer && <VehicleFeature key="stab" name="Stabilizer" />,
    weapons.some((weapon) => weapon.data.name === 'Smoke Grenade') && (
      <VehicleFeature key="smoke" name="Smoke grenades" />
    ),
    weapons.some((weapon) => weapon.data.name === 'Flares') && (
      <VehicleFeature key="flares" name="Flares" />
    ),
  ].filter(Boolean);

  const isFixed =
    turret.data.traverse.speed.horizontal === 0 &&
    turret.data.traverse.speed.vertical === 0;
  const traversalTable: Table = [
    ['Traversal', null],
    turret.data.traverse.mouseAim ? ['Mouse aim', 'Yes'] : undefined,
    ...((isFixed
      ? [['Fixed', 'Yes']]
      : [
          [
            'Horizontal speed',
            <>
              <FormatNumber
                style="unit"
                unit="degree-per-second"
                value={turret.data.traverse.speed.horizontal}
              />
            </>,
          ],
          [
            'Vertical speed',
            <>
              <FormatNumber
                style="unit"
                unit="degree-per-second"
                value={turret.data.traverse.speed.vertical}
              />
            </>,
          ],
        ]) as Row[]),
    [
      'Vertical limits',
      <>
        <FormatNumber
          style="unit"
          unit="degree"
          unitDisplay="narrow"
          value={turret.data.traverse.vertical.min}
        />
        –
        <FormatNumber
          style="unit"
          unit="degree"
          unitDisplay="narrow"
          value={turret.data.traverse.vertical.max}
        />
      </>,
    ],
  ];

  return (
    <TitledCard
      as="section"
      collapsible
      innerPadding={4}
      title={turret.name}
      withAnchor
    >
      <Stack gap={4}>
        {features.length > 0 && (
          <Flex flexWrap="wrap" gap={2}>
            {features}
          </Flex>
        )}

        <StatsTable tables={[traversalTable]} />

        <Weapons
          turret={turret}
          weapons={weapons
            .filter(
              (weapon) =>
                weapon.data.name !== 'Smoke Grenade' &&
                weapon.data.name !== 'Flares',
            )
            .sort((a, b) => a.data.orderIndex - b.data.orderIndex)}
        />

        <Sights turret={turret} />
      </Stack>
    </TitledCard>
  );
}
