import { Chart, useChart } from '@chakra-ui/charts';
import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { VehiclesPlaceDataVehicleDriveDataMetrics } from '@generated/vehicles';

const POWER_LABEL = 'Power';
const TORQUE_LABEL = 'Torque';
const OUTPUT_TORQUE_LABEL = 'Output torque';

const NM_LABELS = new Set([TORQUE_LABEL, OUTPUT_TORQUE_LABEL]);

export default function EngineChart({
  idleRPM,
  points,
}: {
  idleRPM: number;
  points: NonNullable<
    VehiclesPlaceDataVehicleDriveDataMetrics['engine']
  >['points'];
}) {
  const hasOutputTorque = points.some(
    (point) => point.outputTorqueNm !== undefined,
  );

  const chart = useChart({
    data: hasOutputTorque
      ? points
      : points.filter((point) => point.rpm >= idleRPM),
    series: [
      {
        color: 'blue.solid',
        label: POWER_LABEL,
        name: 'powerHp',
        yAxisId: 'power',
      },
      {
        color: 'orange.solid',
        label: TORQUE_LABEL,
        name: 'torqueNm',
        yAxisId: 'torque',
      },
      ...(hasOutputTorque
        ? [
            {
              color: 'purple.solid',
              label: OUTPUT_TORQUE_LABEL,
              name: 'outputTorqueNm' as const,
              yAxisId: 'torque',
            },
          ]
        : []),
    ],
  });

  return (
    <Chart.Root chart={chart} maxHeight="2xs">
      <LineChart
        data={chart.data}
        margin={{ bottom: 0, left: 0, right: 0, top: 20 }}
        responsive
      >
        <CartesianGrid
          stroke={chart.color('border.emphasized')}
          strokeDasharray="3 3"
          yAxisId="power"
        />

        {hasOutputTorque && (
          <ReferenceLine
            stroke={chart.color('fg.muted')}
            strokeDasharray="3 3"
            x={idleRPM}
            yAxisId="power"
            label={{
              fill: chart.color('fg.muted'),
              fontSize: 12,
              position: 'insideTopRight',
              value: 'Idle',
            }}
          />
        )}

        <XAxis
          axisLine={{ stroke: chart.color('border.emphasized') }}
          dataKey={chart.key('rpm')}
          domain={['dataMin', 'dataMax']}
          height={40}
          stroke={chart.color('border')}
          minTickGap={24}
          tick={{ fill: chart.color('fg.muted'), fontSize: 12 }}
          tickCount={7}
          tickLine={{ stroke: chart.color('border.emphasized') }}
          tickMargin={8}
          type="number"
          label={{
            fill: chart.color('fg.muted'),
            position: 'insideBottom',
            value: 'Engine speed (RPM)',
          }}
        />
        <YAxis
          axisLine={{ stroke: chart.color('border.emphasized') }}
          stroke={chart.color('border')}
          tick={{ fill: chart.color('fg.muted'), fontSize: 12 }}
          tickLine={{ stroke: chart.color('border.emphasized') }}
          tickMargin={10}
          width={64}
          yAxisId="power"
          label={{
            angle: -90,
            fill: chart.color('fg.muted'),
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
            value: 'Power (PS)',
          }}
        />
        <YAxis
          axisLine={{ stroke: chart.color('border.emphasized') }}
          orientation="right"
          stroke={chart.color('border')}
          tick={{ fill: chart.color('fg.muted'), fontSize: 12 }}
          tickLine={{ stroke: chart.color('border.emphasized') }}
          tickMargin={10}
          width={72}
          yAxisId="torque"
          label={{
            angle: 90,
            fill: chart.color('fg.muted'),
            position: 'insideRight',
            style: { textAnchor: 'middle' },
            value: 'Torque (Nm)',
          }}
        />

        <Tooltip
          animationDuration={100}
          content={
            <Chart.Tooltip
              formatter={(value: number, name: string) =>
                NM_LABELS.has(name)
                  ? [` ${value} Nm`, name]
                  : [` ${value} hp`, name]
              }
              labelFormatter={(label) => `${label} RPM`}
            />
          }
          cursor={{
            stroke: chart.color('fg.muted'),
            strokeDasharray: '3 3',
          }}
        />

        <Legend content={<Chart.Legend />} />

        {chart.series.map((item) => (
          <Line
            key={item.name}
            dataKey={chart.key(item.name)}
            dot={false}
            isAnimationActive={false}
            stroke={chart.color(item.color)}
            strokeWidth={2}
            yAxisId={item.yAxisId}
          />
        ))}
      </LineChart>
    </Chart.Root>
  );
}
