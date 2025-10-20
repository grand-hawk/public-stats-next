import { Spinner, Stack } from '@chakra-ui/react';
import { useIsClient } from '@uidotdev/usehooks';
import dynamic from 'next/dynamic';
import React from 'react';

import ErrorState from '@/components/states/errorState';
import NoDataFoundState from '@/components/states/noDataFoundState';
import { useFilterStore } from '@/stores/winrate/filters';
import { trpc } from '@/utils/trpc';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function WinrateChart({ placeId }: { placeId: number }) {
  const isClient = useIsClient();
  const loadout = useFilterStore((s) => s.loadout);
  const map = useFilterStore((s) => s.map);

  const { isFetching, error, data, refetch } = trpc.winrate.winrate.useQuery(
    { placeId, loadout, map },
    { refetchOnWindowFocus: false, refetchOnMou  const winrateData = data?.map((value) => {
    return { name: value.name, data: value.data };
  });
      }),
    [data],
  );

  if (isFetching) return <Spinner size="lg" />;
  if (error)
    return (
      <ErrorState
        error={error.message}
        onClick={() => !isFetching && refetch()}
      />
    );
  if (!winrateData)
    return <NoDataFoundState onClick={() => !isFetching && refetch()} />;

  const percentageFormatter = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'percent',
    }).format(value / 100);

  const colors = [
    '#ef4444',
    '#3b82f6',
    '#22c55e',
    '#f97316',
    '#a855f7',
    '#db2777',
    '#22d3ee',
  ];

  const baseOptions = {
    chart: {
      id: 'winrate',
      toolbar: {
        show: false,
      },
      stacked: false,
      background: 'transparent',
      foreColor: 'var(--chakra-colors-fg)',
      fontFamily: 'var(--chakra-fonts-body)',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    markers: {
      strokeColors: 'var(--chakra-colors-border-muted)',
    },
    theme: {
      mode: 'dark',
    },
    colors,
    tooltip: {
      shared: true,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'MMM dd',
      },
      tooltip: {
        enabled: false,
      },
    },
  } satisfies ApexCharts.ApexOptions;

  return (
    <Stack gap={4} height="100%" width="100%">
      {isClient && (
        <ApexCharts
          options={{
            ...baseOptions,
            yaxis: {
              min: 0,
              max: 100,
              title: {
                text: 'Winrate',
              },
              labels: {
                formatter: percentageFormatter,
              },
            },
          }}
          series={winrateData}
          type="line"
        />
      )}
    </Stack>
  );
}
