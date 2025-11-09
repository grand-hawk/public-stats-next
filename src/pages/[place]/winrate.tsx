import { Code, Flex, Grid, Span, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import { useQueryState } from 'nuqs';
import React from 'react';
import slug from 'slug';

import SimpleSelect from '@/components/simpleSelect';
import { Alert } from '@/components/ui/alert';
import Layout from '@/components/utils/layout';
import WinrateChartRoot from '@/components/winrate/chart/root';
import { usePlace } from '@/hooks/usePlace';
import { formatTitle } from '@/utils/formatTitle';
import { slugifyArray } from '@/utils/slugifyArray';
import { trpc } from '@/utils/trpc';

export default function PlaceWinrate() {
  const place = usePlace()!;
  const [loadout, setLoadout] = useQueryState('loadout');
  const [map, setMap] = useQueryState('map');

  const [winrateMetadata] = trpc.winrate.metadata.useSuspenseQuery({
    placeId: place.placeId,
  });

  const [loadoutSlugs, mapSlugs] = React.useMemo(() => {
    return [
      slugifyArray(winrateMetadata?.loadout ?? []),
      slugifyArray(winrateMetadata?.map ?? []),
    ];
  }, [winrateMetadata]);

  const actualLoadout = loadout && loadoutSlugs[loadout];
  const actualMap = map && mapSlugs[map];

  const title = 'Winrate';

  return (
    <>
      <Head>
        <title>{formatTitle(title, place.initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />
      </Head>

      <Layout>
        <Flex justifyContent="center">
          <Stack as="main" gap={4} maxWidth="2xl" width="100%">
            <Grid gap={2} templateColumns="repeat(2, 1fr)">
              <SimpleSelect
                items={winrateMetadata?.loadout ?? []}
                label="Loadout"
                noValueLabel="All"
                value={actualLoadout}
                onValueChange={(value) =>
                  setLoadout(value ? slug(value) : null)
                }
              />
              <SimpleSelect
                items={winrateMetadata?.map ?? []}
                label="Map"
                noValueLabel="All"
                value={actualMap}
                onValueChange={(value) => setMap(value ? slug(value) : null)}
              />
            </Grid>

            <WinrateChartRoot loadout={actualLoadout} map={actualMap} />

            <Alert
              background="bg.subtle"
              borderStartColor="blue.600"
              borderStartWidth={4}
              colorPalette="gray"
              startElement
              title="Calculation"
              marginTop={4}
            >
              Daily team winrate (not cumulative). For each day, the winner is
              the team with the highest final score (ties pick the first).{' '}
              <Span whiteSpace="nowrap">
                Winrate = <Code>wins / games x 100</Code>
              </Span>{' '}
              for that day.
            </Alert>
          </Stack>
        </Flex>
      </Layout>
    </>
  );
}
