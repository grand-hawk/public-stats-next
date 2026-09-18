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

type Points =
  VehiclesPlaceDataVehicleDriveDataMetrics['tractiveEffort']['gears'][number]['points'];

function pullAt(points: Points, kmh: number) {
  const last = points[points.length - 1];
  if (kmh < points[0].kmh || kmh > last.kmh) return null;

  const index = points.findIndex((point) => point.kmh >= kmh);
  const high = points[index];
  if (index === 0 || high.kmh === kmh) return high.teOverWeight;

  const low = points[index - 1];
  const ratio = (kmh - low.kmh) / (high.kmh - low.kmh);
  const value =
    low.teOverWeight + ratio * (high.teOverWeight - low.teOverWeight);

  return Math.round(value * 1000) / 1000;
}

export default function TractiveEffortChart({
  stepless,
  tractiveEffort,
  vmax,
}: {
  stepless: boolean;
  tractiveEffort: VehiclesPlaceDataVehicleDriveDataMetrics['tractiveEffort'];
  vmax: number;
}) {
  const { gears, gradeDemands } = tractiveEffort;

  const speeds = speedGrid(
    Math.max(...gears.map((gear) => gear.points[gear.points.length - 1].kmh)),
    gears.flatMap((gear) => gear.points.map((point) => point.kmh)),
  );

  const data = speeds.map((kmh) => {
    const row: GearingChartRow = { kmh };

    for (const gear of gears) {
      row[`gear${gear.gear}`] = pullAt(gear.points, kmh);
    }

    return row;
  });

  const chart = useChart({ data, series: gearSeries(gears, stepless) });

  return (
    <GearingChartShell
      chart={chart}
      formatValue={(value) => ` ${value}`}
      vmax={vmax}
      yLabel="Pull (× weight)"
    >
      {gradeDemands.map((demand) => (
        <ReferenceLine
          key={demand.gradePercent}
          stroke={chart.color('border.emphasized')}
          strokeDasharray="4 4"
          y={demand.teOverWeight}
          label={{
            fill: chart.color('fg.muted'),
            position: 'right',
            value: `${demand.gradePercent}%`,
          }}
        />
      ))}
    </GearingChartShell>
  );
}
