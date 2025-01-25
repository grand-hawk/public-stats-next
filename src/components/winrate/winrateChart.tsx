import { Box, Group, Spinner } from '@chakra-ui/react';
import { useIsClient } from '@uidotdev/usehooks';
import dynamic from 'next/dynamic';
import React from 'react';
import { BiErrorAlt } from 'react-icons/bi';
import { MdWarning } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useFilterStore } from '@/stores/winrate/filters';
import { trpc } from '@/utils/trpc';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function WinrateChart({ placeId }: { placeId: number }) {
  const isClient = useIsClient();
  const loadout = useFilterStore((s) => s.loadout);
  const map = useFilterStore((s) => s.map);

  const { isFetching, error, data, refetch } = trpc.winrate.winrate.useQuery(
    { placeId, loadout, map },
    { refetchOnWindowFocus: false },
  );

  if (isFetching) return <Spinner size="lg" />;
  if (error)
    return (
      <EmptyState
        description={error.message}
        icon={<BiErrorAlt />}
        title="Error"
      >
        <Group>
          <Button onClick={() => !isFetching && refetch()}>Retry</Button>
        </Group>
      </EmptyState>
    );
  if (!data)
    return (
      <EmptyState icon={<MdWarning />} title="No data found">
        <Group>
          <Button onClick={() => !isFetching && refetch()}>Refetch</Button>
        </Group>
      </EmptyState>
    );

  const valueFormatter = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'percent',
    }).format(value / 100);

  return (
    <Box height="100%" width="100%">
      {isClient && (
        <ApexCharts
          options={{
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
              // size: 4,
              // shape: 'circle',
              // strokeWidth: 1,
              strokeColors: 'var(--chakra-colors-border-muted)',
            },
            theme: {
              mode: 'dark',
            },
            colors: [
              '#ef4444',
              '#3b82f6',
              '#22c55e',
              '#f97316',
              '#a855f7',
              '#db2777',
              '#22d3ee',
            ],
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
            yaxis: {
              labels: {
                formatter: valueFormatter,
              },
            },
          }}
          series={data}
          type="line"
        />
      )}
    </Box>
  );
}
