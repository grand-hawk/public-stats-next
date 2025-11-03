import { Center, Spinner } from '@chakra-ui/react';
import { useIsClient } from '@uidotdev/usehooks';
import React, { Suspense } from 'react';

import { EmptyState } from '@/components/ui/empty-state';
import WinrateChart from '@/components/winrate/chart/chart';
import { usePlace } from '@/hooks/usePlace';
import { useWinrateFiltersStore } from '@/stores/winrate/filters';
import { trpc } from '@/utils/trpc';

export default function WinrateChartRoot() {
  const place = usePlace()!;
  const isClient = useIsClient();
  const loadout = useWinrateFiltersStore((s) => s.loadout);
  const map = useWinrateFiltersStore((s) => s.map);

  const { data, isPending } = trpc.winrate.chart.useQuery({
    placeId: place.placeId,
    loadout: loadout || '*',
    map: map || '*',
  });

  const spinner = (
    <Center minHeight="xs">
      <Spinner />
    </Center>
  );

  if (!isClient || isPending) return spinner;
  if (!data || data.series.length === 0)
    return <EmptyState title="No data found" />;
  return (
    <Suspense fallback={spinner}>
      <WinrateChart data={data} />
    </Suspense>
  );
}
