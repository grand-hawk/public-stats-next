import { Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import { XSSpinner } from '@/components/common/spinners';
import { CHART_HEIGHT } from '@/components/features/winrate/chart/constants';
import { EmptyState } from '@/components/ui/empty-state';
import ChartCard from '@/components/wiki/chartCard';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

const WinrateChart = dynamic(
  () => import('@/components/features/winrate/chart/chart'),
  {
    ssr: false,
    loading: () => (
      <Flex alignItems="center" height={CHART_HEIGHT} justifyContent="center">
        <XSSpinner />
      </Flex>
    ),
  },
);

export default function WinrateChartRoot({
  loadout,
  map,
}: {
  loadout: string | null;
  map: string | null;
}) {
  const place = usePlace()!;

  const { data, isPending } = trpc.winrate.chart.useQuery({
    placeId: place.placeId,
    loadout: loadout || '*',
    map: map || '*',
  });

  return (
    <ChartCard>
      {isPending ? (
        <Flex alignItems="center" height={CHART_HEIGHT} justifyContent="center">
          <XSSpinner />
        </Flex>
      ) : !data || data.series.length === 0 ? (
        <Flex alignItems="center" height={CHART_HEIGHT} justifyContent="center">
          <EmptyState title="No data found" />
        </Flex>
      ) : (
        <WinrateChart data={data} />
      )}
    </ChartCard>
  );
}
