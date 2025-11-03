import dynamic from 'next/dynamic';
import React from 'react';

import { XSSpinner } from '@/components/spinners';
import { EmptyState } from '@/components/ui/empty-state';
import { usePlace } from '@/hooks/usePlace';
import { useWinrateFiltersStore } from '@/stores/winrate/filters';
import { trpc } from '@/utils/trpc';

const WinrateChart = dynamic(() => import('@/components/winrate/chart/chart'), {
  ssr: false,
  loading: () => <XSSpinner />,
});

export default function WinrateChartRoot() {
  const place = usePlace()!;
  const loadout = useWinrateFiltersStore((s) => s.loadout);
  const map = useWinrateFiltersStore((s) => s.map);

  const { data, isPending } = trpc.winrate.chart.useQuery({
    placeId: place.placeId,
    loadout: loadout || '*',
    map: map || '*',
  });

  if (isPending) return <XSSpinner />;
  if (!data || data.series.length === 0)
    return <EmptyState title="No data found" />;
  return <WinrateChart data={data} />;
}
