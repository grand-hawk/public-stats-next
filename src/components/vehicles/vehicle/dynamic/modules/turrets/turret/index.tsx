import { Flex, FormatNumber, Stack } from '@chakra-ui/react';
import React from 'react';

import StatsTable from '@/components/statsTables';
import TitledCard from '@/components/vehicles/titledCard';
import Sight from '@/components/vehicles/vehicle/dynamic/modules/turrets/turret/sight';
import VehicleFeature from '@/components/vehicles/vehicle/feature';

import type { Row, Table } from '@/components/statsTables';
import type { TurretWithName } from '@/components/vehicles/vehicle/dynamic/modules/turrets';

export default function Turret({ turret }: { turret: TurretWithName }) {
  const data = turret.data;

  const features = [
    data.lws && <VehicleFeature key="lws" name="Laser warning system" />,
    data.maws && (
      <VehicleFeature key="maws" name="Missile approach warning system" />
    ),
    data.stabilizer && <VehicleFeature key="stab" name="Stabilizer" />,
  ].filter(Boolean);

  const isFixed =
    data.traverse.speed.horizontal === 0 && data.traverse.speed.vertical === 0;
  const traversalTable: Table = [
    ['Traversal', null],
    data.traverse.mouseAim ? ['Mouse aim', 'Yes'] : undefined,
    ...((isFixed
      ? [['Fixed', 'Yes']]
      : [
          [
            'Horizontal speed',
            <>
              <FormatNumber
                style="unit"
                unit="degree-per-second"
                value={data.traverse.speed.horizontal}
              />
            </>,
          ],
          [
            'Vertical speed',
            <>
              <FormatNumber
                style="unit"
                unit="degree-per-second"
                value={data.traverse.speed.vertical}
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
          value={data.traverse.vertical.min}
        />
        –
        <FormatNumber
          style="unit"
          unit="degree"
          unitDisplay="narrow"
          value={data.traverse.vertical.max}
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

        <Stack gap={2}>
          {data.sights.map((sight, index) => (
            <Sight
              key={index}
              onlySight={data.sights.length === 1}
              sight={sight}
              sightIndex={index}
              turretName={turret.name}
            />
          ))}
        </Stack>
      </Stack>
    </TitledCard>
  );
}
