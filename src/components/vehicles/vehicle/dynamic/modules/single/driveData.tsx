import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import StatsTable from '@/components/statsTables';
import TitledCard from '@/components/vehicles/titledCard';

import type { Table } from '@/components/statsTables';
import type { SingleModuleProps } from '@/components/vehicles/vehicle/dynamic/modules/single';

export default function DriveData({ module }: SingleModuleProps<'DriveData'>) {
  const speedTable: Table = [
    ['Max speed', null],
    [
      'Forward',
      <>
        <FormatNumber
          style="unit"
          unit="kilometer-per-hour"
          value={module.data.engine.forwardSpeed}
        />
      </>,
    ],
    [
      'Backward',
      <>
        <FormatNumber
          style="unit"
          unit="kilometer-per-hour"
          value={module.data.engine.reverseSpeed}
        />
      </>,
    ],
    module.data.engine.amphibiousSpeed
      ? [
          'Amphibious',
          <>
            <FormatNumber
              style="unit"
              unit="kilometer-per-hour"
              value={module.data.engine.amphibiousSpeed}
            />
          </>,
        ]
      : undefined,
  ];

  const powerTable: Table = [
    [
      'Power-to-weight ratio',
      <>
        <FormatNumber
          maximumFractionDigits={1}
          value={module.data.engine.horsepower / module.data.mass}
        />{' '}
        hp/t
      </>,
    ],
    [
      'Engine power',
      <>
        <FormatNumber value={module.data.engine.horsepower} /> hp
      </>,
    ],
    [
      'Weight',
      <>
        <FormatNumber value={module.data.mass} /> t
      </>,
    ],
  ];

  const suspensionTable: Table | undefined =
    module.data.suspensionControl.height ||
    module.data.suspensionControl.horizontal ||
    module.data.suspensionControl.vertical
      ? [
          ['Active suspension', null],
          ['Ride height', module.data.suspensionControl.height ? 'Yes' : 'No'],
          [
            'Lateral roll',
            module.data.suspensionControl.horizontal ? 'Yes' : 'No',
          ],
          ['Pitch', module.data.suspensionControl.vertical ? 'Yes' : 'No'],
        ]
      : undefined;

  return (
    <TitledCard innerPadding={4} title="Mobility" withAnchor>
      <StatsTable tables={[speedTable, powerTable, suspensionTable]} />
    </TitledCard>
  );
}
