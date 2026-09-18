import { useChart } from '@chakra-ui/charts';
import React from 'react';
import { ReferenceLine } from 'recharts';

import GearingChartShell from '@/components/features/vehicles/vehicle/dynamic/modules/gearing/chartShell';
import {
  gearSeries,
  speedGrid,
} from '@/components/features/vehicles/vehicle/dynamic/modules/gearing/shared';

import type { GearingChartRow } from '@/components/features/vehicles/vehicle/dynamic/modules/gearing/chartShell';
import type { VehiclesPlaceDataVehicleDriveDataMetrics } from '@generated/vehicles';

export default function GearingChart({
  gears,
  idleRPM,
  maxRPM,
  vmax,
}: {
  gears: VehiclesPlaceDataVehicleDriveDataMetrics['gears']['forward'];
  idleRPM: number;
  maxRPM: number;
  vmax: number;
}) {
  const rpmAt = (kmh: number, topKmh: number) => (maxRPM * kmh) / topKmh;
  const idleKmh = (topKmh: number) =>
    Math.round((topKmh * idleRPM * 10) / maxRPM) / 10;

  const speeds = speedGrid(
    Math.max(...gears.map((gear) => gear.topKmh)),
    gears.flatMap((gear) => [idleKmh(gear.topKmh), gear.topKmh]),
  );

  const data = speeds.map((kmh) => {
    const row: GearingChartRow = { kmh };

    for (const gear of gears) {
      const inRange =
        kmh >= idleKmh(gear.topKmh) - 1e-6 && kmh <= gear.topKmh + 1e-6;

      row[`gear${gear.gear}`] = inRange
        ? Math.round(rpmAt(kmh, gear.topKmh))
        : null;
    }

    return row;
  });

  const chart = useChart({ data, series: gearSeries(gears) });

  return (
    <GearingChartShell
      chart={chart}
      formatValue={(value) => ` ${value} RPM`}
      vmax={vmax}
      yDomain={[0, maxRPM]}
      yLabel="Engine speed (RPM)"
    >
      <ReferenceLine
        stroke={chart.color('border.emphasized')}
        strokeDasharray="4 4"
        y={idleRPM}
        label={{
          fill: chart.color('fg.muted'),
          position: 'right',
          value: 'Idle',
        }}
      />
    </GearingChartShell>
  );
}
