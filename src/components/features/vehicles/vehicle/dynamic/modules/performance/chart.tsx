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

const FORWARD_LABEL = 'Forward';
const REVERSE_LABEL = 'Reverse';

interface Row {
  kmh?: number;
  reverseKmh?: number;
  seconds: number;
}

export default function AccelerationChart({
  curve,
  intervalSeconds,
  reverseCurve,
  reverseIntervalSeconds,
}: {
  curve: number[];
  intervalSeconds: number;
  reverseCurve?: number[];
  reverseIntervalSeconds?: number;
}) {
  const reverse =
    reverseCurve?.length && reverseIntervalSeconds
      ? { curve: reverseCurve, intervalSeconds: reverseIntervalSeconds }
      : null;

  const bySeconds = new Map<number, Row>();
  const addCurve = (
    values: number[],
    interval: number,
    key: 'kmh' | 'reverseKmh',
  ) => {
    values.forEach((kmh, index) => {
      const seconds = Number(((index + 1) * interval).toFixed(2));
      const row = bySeconds.get(seconds) ?? { seconds };
      row[key] = kmh;
      bySeconds.set(seconds, row);
    });
  };

  addCurve(curve, intervalSeconds, 'kmh');
  if (reverse) addCurve(reverse.curve, reverse.intervalSeconds, 'reverseKmh');

  const maxSeconds = Math.max(0, ...bySeconds.keys());
  const timeMarkers = [0, 5, 10, 15, 20, 30, 45, 60, 90].filter(
    (seconds) => seconds <= maxSeconds,
  );
  for (let seconds = 120; seconds <= maxSeconds; seconds *= 2) {
    timeMarkers.push(seconds);
  }

  const chart = useChart({
    data: [...bySeconds.values()].sort((a, b) => a.seconds - b.seconds),
    series: [
      { color: 'blue.solid', label: FORWARD_LABEL, name: 'kmh' },
      ...(reverse
        ? [
            {
              color: 'orange.solid',
              label: REVERSE_LABEL,
              name: 'reverseKmh' as const,
            },
          ]
        : []),
    ],
  });

  return (
    <Chart.Root chart={chart} maxHeight="2xs">
      <LineChart data={chart.data} responsive>
        <CartesianGrid
          stroke={chart.color('border.emphasized')}
          strokeDasharray="3 3"
          vertical={false}
        />

        {timeMarkers.map((seconds) => (
          <ReferenceLine
            key={seconds}
            stroke={chart.color('border.emphasized')}
            strokeDasharray="3 3"
            x={seconds}
          />
        ))}

        <XAxis
          axisLine={{ stroke: chart.color('border.emphasized') }}
          dataKey={chart.key('seconds')}
          domain={[0, 'dataMax']}
          height={40}
          stroke={chart.color('border')}
          tickFormatter={(value) => `${value}s`}
          interval="preserveStartEnd"
          minTickGap={8}
          tick={{ fill: chart.color('fg.muted'), fontSize: 12 }}
          ticks={timeMarkers}
          tickLine={{ stroke: chart.color('border.emphasized') }}
          tickMargin={8}
          type="number"
          label={{
            fill: chart.color('fg.muted'),
            position: 'insideBottom',
            value: 'Time from standstill',
          }}
        />
        <YAxis
          axisLine={{ stroke: chart.color('border.emphasized') }}
          stroke={chart.color('border')}
          tickFormatter={(value) => `${value}`}
          tick={{ fill: chart.color('fg.muted'), fontSize: 12 }}
          tickLine={{ stroke: chart.color('border.emphasized') }}
          tickMargin={10}
          width={64}
          label={{
            angle: -90,
            fill: chart.color('fg.muted'),
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
            value: 'Speed (km/h)',
          }}
        />

        <Tooltip
          animationDuration={100}
          content={
            <Chart.Tooltip
              formatter={(value: number, name: string) => [
                ` ${value} km/h`,
                name,
              ]}
              labelFormatter={(label) => `${label}s`}
            />
          }
          cursor={{
            stroke: chart.color('fg.muted'),
            strokeDasharray: '3 3',
          }}
        />

        {reverse && <Legend content={<Chart.Legend />} />}

        {chart.series.map((item) => (
          <Line
            connectNulls
            dataKey={chart.key(item.name)}
            dot={false}
            isAnimationActive={false}
            key={item.name}
            stroke={chart.color(item.color)}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </Chart.Root>
  );
}
