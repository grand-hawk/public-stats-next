import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import StatsTable from '@/components/statsTables';
import ColumnsIfPossible from '@/components/vehicles/columnsIfPossible';
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

  const miscVehicleTable: Table = [
    ['Vehicle', null],
    [
      'Weight',
      <>
        <FormatNumber value={module.data.mass} /> t
      </>,
    ],
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

  const engineTable: Table = [
    ['Engine', module.data.engine.name],
    ['Type', module.data.engine.type],
    [
      'Horsepower',
      <>
        <FormatNumber value={module.data.engine.horsepower} /> hp
      </>,
    ],
    [
      'Max RPM',
      <>
        <FormatNumber value={module.data.engine.maxRPM} /> RPM
      </>,
    ],
  ];

  const transmissionTable: Table = [
    ['Transmission', null],
    ['Forward gears', module.data.transmission.forwardGears],
    ['Reverse gears', module.data.transmission.reverseGears],
    module.data.transmission.neutralSteering
      ? ['Neutral steering', 'Yes']
      : undefined,
    module.data.transmission.automatic
      ? ['Automatic gearbox', 'Yes']
      : undefined,
  ];

  return (
    <ColumnsIfPossible>
      <TitledCard
        as="section"
        collapsible
        innerPadding={4}
        title="Mobility"
        withAnchor
      >
        <StatsTable tables={[speedTable, miscVehicleTable, suspensionTable]} />
      </TitledCard>

      <TitledCard
        as="section"
        collapsible
        innerPadding={4}
        title="Powertrain"
        withAnchor
      >
        <StatsTable tables={[engineTable, transmissionTable]} />
      </TitledCard>
    </ColumnsIfPossible>
  );
}
