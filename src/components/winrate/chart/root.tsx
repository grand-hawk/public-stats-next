import { Center, Spinner } from '@chakra-ui/react';
import { useIsClient } from '@uidotdev/usehooks';
import React from 'react';

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

  if (!isClient || isPending)
    return (
      <Center minHeight="xs">
        <Spinner />
      </Center>
    );
  return <WinrateChart data={data || { data: [], series: [] }} />;
}
