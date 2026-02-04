import dynamic from 'next/dynamic';
import React from 'react';

import { XSSpinner } from '@/components/common/spinners';
import { EmptyState } from '@/components/ui/empty-state';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

const WinrateChart = dynamic(
  () => import('@/components/features/winrate/chart/chart'),
  {
    ssr: false,
    loading: () => <XSSpinner />,
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

  if (isPending) return <XSSpinner />;
  if (!data || data.series.length === 0)
    return <EmptyState title="No data found" minHeight="xs" />;
  return <WinrateChart data={data} />;
}
