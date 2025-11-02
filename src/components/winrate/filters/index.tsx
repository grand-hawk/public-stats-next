import { Grid } from '@chakra-ui/react';
import React from 'react';

import WinrateFiltersSelect from '@/components/winrate/filters/select';
import { usePlace } from '@/hooks/usePlace';
import { useWinrateFiltersStore } from '@/stores/winrate/filters';
import { trpc } from '@/utils/trpc';

export default function WinrateFilters() {
  const place = usePlace()!;
  const loadout = useWinrateFiltersStore((s) => s.loadout);
  const setLoadout = useWinrateFiltersStore((s) => s.setLoadout);
  const map = useWinrateFiltersStore((s) => s.map);
  const setMap = useWinrateFiltersStore((s) => s.setMap);

  const [winrateMetadata] = trpc.winrate.metadata.useSuspenseQuery({
    placeId: place.placeId,
  });

  return (
    <Grid gap={2} templateColumns="repeat(2, 1fr)">
      <WinrateFiltersSelect
        items={winrateMetadata?.loadout ?? []}
        label="Loadout"
        value={loadout}
        onValueChange={(value) => setLoadout(value ? String(value) : null)}
      />
      <WinrateFiltersSelect
        items={winrateMetadata?.map ?? []}
        label="Map"
        value={map}
        onValueChange={(value) => setMap(value ? String(value) : null)}
      />
    </Grid>
  );
}
