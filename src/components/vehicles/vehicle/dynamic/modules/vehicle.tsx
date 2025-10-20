import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import StatsTable from '@/components/statsTables';
import TitledCard from '@/components/vehicles/titledCard';
import { useDynamicData } from '@/hooks/contexts/dynamicData';
import { getAllModulesOfType, getOneModuleOfType } from '@/utils/alterations';

import type { Table } from '@/components/statsTables';

export default function Vehicle() {
  const { assembledModules } = useDynamicData();

  const driveData = getOneModuleOfType('DriveData', assembledModules);
  const seats = getAllModulesOfType('Seat', assembledModules);

  if (!driveData && seats.length === 0) return null;

  // Vehicle card

  const rootTable: Table | undefined = driveData
    ? [
        [null],
        [
          'Weight',
          <>
            <FormatNumber
              maximumFractionDigits={1}
              value={driveData.data.mass}
            />{' '}
            t
          </>,
        ],
      ]
    : undefined;

  const seatCount: Record<string, number> = {};
  for (const seat of seats) {
    const name = seat.data.name;

    if (!seatCount[name]) seatCount[name] = 0;
    seatCount[name] += 1;
  }

  const seatingCapacity: Table | undefined =
    seats.length > 0
      ? [
          ['Seating capacity', String(seats.length)],
          ...Object.entries(seatCount),
        ]
      : undefined;

  const speedTable: Table | undefined = driveData
    ? [
        ['Max speed', null],
        [
          'Forward',
          <>
            <FormatNumber
              style="unit"
              unit="kilometer-per-hour"
              value={driveData.data.engine.forwardSpeed}
            />
          </>,
        ],
        [
          'Backward',
          <>
            <FormatNumber
              style="unit"
              unit="kilometer-per-hour"
              value={driveData.data.engine.reverseSpeed}
            />
          </>,
        ],
        driveData.data.engine.amphibiousSpeed
          ? [
              'Amphibious',
              <>
                <FormatNumber
                  style="unit"
                  unit="kilometer-per-hour"
                  value={driveData.data.engine.amphibiousSpeed}
                />
              </>,
            ]
          : undefined,
      ]
    : undefined;

  const suspensionTable: Table | undefined =
    driveData?.data.suspensionControl.height ||
    driveData?.data.suspensionControl.horizontal ||
    driveData?.data.suspensionControl.vertical
      ? [
          ['Active suspension', null],
          [
            'Ride height',
            driveData.data.suspensionControl.height ? 'Yes' : 'No',
          ],
          [
            'Lateral roll',
            driveData.data.suspensionControl.horizontal ? 'Yes' : 'No',
          ],
          ['Pitch', driveData.data.suspensionControl.vertical ? 'Yes' : 'No'],
        ]
      : undefined;

  // Powertrain card

  const engineTable: Table | undefined = driveData
    ? [
        ['Engine', driveData.data.engine.name],
        ['Type', driveData.data.engine.type],
        [
          'Max RPM',
          <>
            <FormatNumber value={driveData.data.engine.maxRPM} /> RPM
          </>,
        ],
        [
          'Horsepower',
          <>
            <FormatNumber value={driveData.data.engine.horsepower} /> hp
          </>,
        ],
        [
          'Power-to-weight ratio',
          <>
            <FormatNumber
              maximumFractionDigits={1}
              value={driveData.data.engine.horsepower / driveData.data.mass}
            />{' '}
            hp/t
          </>,
        ],
      ]
    : undefined;

  const transmissionTable: Table | undefined = driveData
    ? [
        ['Transmission', null],
        ['Forward gears', driveData.data.transmission.forwardGears],
        ['Reverse gears', driveData.data.transmission.reverseGears],
        driveData.data.transmission.neutralSteering
          ? ['Neutral steering', 'Yes']
          : undefined,
        driveData.data.transmission.automatic
          ? ['Automatic gearbox', 'Yes']
          : undefined,
      ]
    : undefined;

  return (
    <>
      <TitledCard
        as="section"
        collapsible
        innerPadding={4}
        title="Vehicle"
        withAnchor
      >
        <StatsTable
          tables={[rootTable, seatingCapacity, speedTable, suspensionTable]}
        />
      </TitledCard>

      {(engineTable || transmissionTable) && (
        <TitledCard
          as="section"
          collapsible
          innerPadding={4}
          title="Powertrain"
          withAnchor
        >
          <StatsTable tables={[engineTable, transmissionTable]} />
        </TitledCard>
      )}
    </>
  );
}
