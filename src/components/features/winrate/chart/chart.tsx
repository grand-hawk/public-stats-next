import { Chart, useChart } from '@chakra-ui/charts';
import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { RouterOutputs } from '@/utils/trpc';

export default function WinrateChart({
  data,
}: {
  data: NonNullable<RouterOutputs['winrate']['chart']>;
}) {
  const chart = useChart(data);

  const timestampKey = chart.key('timestamp');

  const weekendAreas = React.useMemo(() => {
    const areas: { x1: number; x2: number }[] = [];
    let areaStart: number | null = null;
    let previousTimestamp: number | null = null;

    for (const point of chart.data) {
      const timestamp = point[timestampKey] as number;
      const day = new Date(timestamp * 1_000).getUTCDay();
      const isWeekend = day === 0 || day === 5 || day === 6;

      if (isWeekend && areaStart === null) {
        areaStart = timestamp;
      } else if (!isWeekend && areaStart !== null) {
        areas.push({ x1: areaStart, x2: previousTimestamp! });
        areaStart = null;
      }
      previousTimestamp = timestamp;
    }

    if (areaStart !== null && previousTimestamp !== null) {
      areas.push({ x1: areaStart, x2: previousTimestamp });
    }

    return areas;
  }, [chart.data, timestampKey]);

  const dateFormatter = (value: unknown) =>
    chart.formatDate({ month: 'short', day: 'numeric' })(
      new Date(Number(value) * 1_000).toISOString(),
    );

  return (
    <Chart.Root chart={chart} maxHeight="sm" marginTop="calc(16px * 2)">
      <LineChart data={chart.data}>
        {weekendAreas.map((area) => (
          <ReferenceArea
            key={area.x1}
            x1={area.x1}
            x2={area.x2}
            fill={chart.color('bg.muted')}
            fillOpacity={0.5}
            stroke="none"
          />
        ))}

        <CartesianGrid stroke={chart.color('border')} vertical={false} />

        <XAxis
          axisLine={false}
          dataKey={chart.key('timestamp')}
          stroke={chart.color('border')}
          tickFormatter={dateFormatter}
        />
        <YAxis
          axisLine={false}
          domain={[0, 100]}
          stroke={chart.color('border')}
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          tickMargin={10}
        />

        <Tooltip
          animationDuration={100}
          content={
            <Chart.Tooltip
              formatter={(value: number, name: string) => [` ${value}%`, name]}
              labelFormatter={(label) => {
                if (label === 'value') return 'value';
                return dateFormatter(label);
              }}
            />
          }
          cursor={false}
        />

        {data.markers &&
          data.markers.map((marker) => (
            <ReferenceLine
              key={marker.x}
              data-test={marker.label}
              x={marker.x}
              stroke={chart.color('border.emphasized')}
              label={{
                value: marker.label,
                fill: chart.color('fg.muted'),
                position: 'top',
                offset: 16,
              }}
            />
          ))}

        <Legend content={<Chart.Legend />} />

        {chart.series.map((item) => (
          <Line
            key={item.name}
            dataKey={chart.key(item.name)}
            dot={false}
            isAnimationActive={false}
            stroke={chart.color(item.color)}
            strokeWidth={2}
            connectNulls
          />
        ))}
      </LineChart>
    </Chart.Root>
  );
}
