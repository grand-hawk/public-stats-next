import { Chart } from '@chakra-ui/charts';
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

import { CHART_MARGIN } from '@/components/features/vehicles/vehicle/dynamic/modules/gearing/shared';

import type { UseChartReturn } from '@chakra-ui/charts';

export type GearingChartRow = Record<string, number | null>;

export default function GearingChartShell({
  chart,
  children,
  formatValue,
  horizontalGrid = true,
  vmax,
  yDomain,
  yLabel,
}: {
  chart: UseChartReturn<GearingChartRow>;
  formatValue: (value: number) => string;
  vmax: number;
  yLabel: string;
  children?: React.ReactNode;
  horizontalGrid?: boolean;
  yDomain?: [number, number];
}) {
  return (
    <Chart.Root chart={chart} maxHeight="2xs">
      <LineChart data={chart.data} margin={CHART_MARGIN} responsive>
        <CartesianGrid
          horizontal={horizontalGrid}
          stroke={chart.color('border.emphasized')}
          strokeDasharray="3 3"
        />

        <XAxis
          axisLine={{ stroke: chart.color('border.emphasized') }}
          dataKey={chart.key('kmh')}
          domain={[0, 'dataMax']}
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
            value: 'Speed (km/h)',
          }}
        />

        <YAxis
          axisLine={{ stroke: chart.color('border.emphasized') }}
          domain={yDomain}
          stroke={chart.color('border')}
          tick={{ fill: chart.color('fg.muted'), fontSize: 12 }}
          tickLine={{ stroke: chart.color('border.emphasized') }}
          tickMargin={10}
          width={72}
          label={{
            angle: -90,
            fill: chart.color('fg.muted'),
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
            value: yLabel,
          }}
        />

        <Tooltip
          animationDuration={100}
          content={
            <Chart.Tooltip
              formatter={(value: number, name: string) => [
                formatValue(value),
                name,
              ]}
              labelFormatter={(label) => `${label} km/h`}
            />
          }
          cursor={{
            stroke: chart.color('fg.muted'),
            strokeDasharray: '3 3',
          }}
        />

        {children}

        <ReferenceLine
          stroke={chart.color('fg.muted')}
          strokeDasharray="2 2"
          x={vmax}
          label={{
            fill: chart.color('fg.muted'),
            position: 'top',
            value: 'Vmax',
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
          />
        ))}
      </LineChart>
    </Chart.Root>
  );
}
