import { Tabs } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import { GiArtilleryShell } from 'react-icons/gi';
import { TbTank } from 'react-icons/tb';

import { CenterSpinner } from '@/components/common/spinners';
import {
  ShellDataLoader,
  VehicleDataLoader,
} from '@/components/features/compare/dataLoaders';
import ShellComparisonTable from '@/components/features/compare/shellComparisonTable';
import { useCompareState } from '@/components/features/compare/useCompareState';
import VehicleComparisonTable from '@/components/features/compare/vehicleComparisonTable';
import ArticlePage from '@/components/layout/articlePage';
import ArticleTitle from '@/components/wiki/articleTitle';
import { WikiTabTrigger, WikiTabsList } from '@/components/wiki/tabs';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

export default function VehicleComparison() {
  const place = usePlace()!;
  const { mode, selectMode, shells, vehicles } = useCompareState();

  const [vehicleList] = trpc.vehicles.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const [shellsList] = trpc.shells.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const flatShells = React.useMemo(() => {
    const result: Array<{ name: string; slug: string; weapon: string }> = [];
    for (const [weapon, weaponShells] of Object.entries(shellsList)) {
      for (const shell of weaponShells) {
        result.push({ name: shell.name, slug: shell.slug, weapon });
      }
    }
    return result;
  }, [shellsList]);

  return (
    <ArticlePage
      band={false}
      placeName={place.placeName}
      titleId="compare-page-title"
      wide
    >
      <ArticleTitle id="compare-page-title" title="Compare" />

      <Tabs.Root
        lazyMount
        value={mode}
        variant="plain"
        css={{ marginBlockStart: '20px', paddingBlockEnd: '32px' }}
        onValueChange={(details) => selectMode(details.value)}
      >
        <WikiTabsList>
          <WikiTabTrigger value="vehicles">
            <TbTank aria-hidden size={16} />
            Vehicles
          </WikiTabTrigger>
          <WikiTabTrigger value="shells">
            <GiArtilleryShell aria-hidden size={16} />
            Shells
          </WikiTabTrigger>
        </WikiTabsList>

        <Tabs.Content padding={0} paddingBlockStart="20px" value="vehicles">
          <Suspense fallback={<CenterSpinner />}>
            <VehicleDataLoader slugs={vehicles.slugs}>
              {(items, loadingCount) => (
                <VehicleComparisonTable
                  allVehicles={vehicleList}
                  loadingCount={loadingCount}
                  vehicles={items}
                  onAdd={vehicles.add}
                  onRemove={vehicles.remove}
                />
              )}
            </VehicleDataLoader>
          </Suspense>
        </Tabs.Content>

        <Tabs.Content padding={0} paddingBlockStart="20px" value="shells">
          <Suspense fallback={<CenterSpinner />}>
            <ShellDataLoader slugs={shells.slugs}>
              {(items, loadingCount) => (
                <ShellComparisonTable
                  allShells={flatShells}
                  loadingCount={loadingCount}
                  shells={items}
                  onAdd={shells.add}
                  onRemove={shells.remove}
                />
              )}
            </ShellDataLoader>
          </Suspense>
        </Tabs.Content>
      </Tabs.Root>
    </ArticlePage>
  );
}
