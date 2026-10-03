import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import { gearLabel } from '@/components/features/vehicles/vehicle/dynamic/modules/gearing/shared';
import { StatsCell, StatsRow } from '@/components/wiki/stats';

import type { VehiclesPlaceDataVehicleDriveDataGear } from '@generated/vehicles';

export default function GearRows({
  gears,
  stepless,
}: {
  gears: VehiclesPlaceDataVehicleDriveDataGear[];
  stepless: boolean;
}) {
  return gears.map((gear) => (
    <StatsRow key={gear.gear} withPaddingLeft>
      <StatsCell>{gearLabel(gear.gear, stepless)}</StatsCell>
      <StatsCell>
        {gear.ratio === undefined ? (
          '—'
        ) : (
          <>
            <FormatNumber maximumFractionDigits={3} value={gear.ratio} />
            :1
          </>
        )}
      </StatsCell>
      <StatsCell>
        <FormatNumber
          maximumFractionDigits={1}
          style="unit"
          unit="kilometer-per-hour"
          value={gear.topKmh}
        />
      </StatsCell>
    </StatsRow>
  ));
}
