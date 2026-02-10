import { Code, Flex, Grid, Span, Stack } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import React from 'react';
import slug from 'slug';

import SimpleSelect from '@/components/common/simpleSelect';
import WinrateChartRoot from '@/components/features/winrate/chart/root';
import Layout from '@/components/layout/layout';
import { Alert } from '@/components/ui/alert';
import { usePlace } from '@/hooks/usePlace';
import { slugifyArray } from '@/utils/slugifyArray';
import { trpc } from '@/utils/trpc';

const EMPTY_ARRAY: string[] = [];

export default function PlaceWinrate() {
  const place = usePlace()!;
  const [loadout, setLoadout] = useQueryState('loadout');
  const [map, setMap] = useQueryState('map');

  const [winrateMetadata] = trpc.winrate.metadata.useSuspenseQuery({
    placeId: place.placeId,
  });

  const loadoutOptions = winrateMetadata?.loadout ?? EMPTY_ARRAY;
  const mapOptions = winrateMetadata?.map ?? EMPTY_ARRAY;

  const [loadoutSlugs, mapSlugs] = React.useMemo(() => {
    return [slugifyArray(loadoutOptions), slugifyArray(mapOptions)];
  }, [loadoutOptions, mapOptions]);

  const firstLoadout = loadoutOptions[0] ?? null;
  const firstLoadoutSlug = React.useMemo(
    () => (firstLoadout ? slug(firstLoadout) : null),
    [firstLoadout],
  );

  React.useEffect(() => {
    if (!firstLoadoutSlug) return;

    if (!loadout || !loadoutSlugs[loadout]) setLoadout(firstLoadoutSlug);
  }, [firstLoadoutSlug, loadout, loadoutSlugs, setLoadout]);

  const actualLoadout =
    loadout && loadoutSlugs[loadout] ? loadoutSlugs[loadout] : null;
  const actualMap = map && mapSlugs[map];

  const resolvedLoadout = actualLoadout ?? firstLoadout ?? null;

  return (
    <Layout>
      <Flex justifyContent="center">
        <Stack as="main" gap={4} maxWidth="2xl" width="100%">
          <Grid gap={2} templateColumns="repeat(2, 1fr)">
            <SimpleSelect
              items={loadoutOptions}
              label="Loadout"
              allowEmpty={false}
              value={resolvedLoadout}
              onValueChange={(value) => setLoadout(value ? slug(value) : null)}
            />
            <SimpleSelect
              items={mapOptions}
              label="Map"
              noValueLabel="All"
              value={actualMap}
              onValueChange={(value) => setMap(value ? slug(value) : null)}
            />
          </Grid>

          <WinrateChartRoot loadout={resolvedLoadout} map={actualMap} />

          <Alert
            background="bg.subtle"
            borderStartColor="blue.600"
            borderStartWidth={4}
            colorPalette="gray"
            startElement
            title="Calculation"
            marginTop={4}
          >
            Daily team winrate (not cumulative). For each day, the winner is the
            team with the highest final score (ties pick the first).{' '}
            <Span whiteSpace="nowrap">
              Winrate = <Code>wins / games x 100</Code>
            </Span>{' '}
            for that day.
          </Alert>
        </Stack>
      </Flex>
    </Layout>
  );
}
