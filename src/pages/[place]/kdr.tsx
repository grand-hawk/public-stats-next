import { Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import { useQueryState } from 'nuqs';
import React from 'react';

import KdrRangeSelect, {
  KDR_RANGE_ITEMS,
} from '@/components/features/kdr/rangeSelect';
import KdrTable from '@/components/features/kdr/table';
import Layout from '@/components/layout/layout';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';

import type { KdrPlaceData } from '@generated/kdr';

export default function PlaceKdr() {
  const initials = usePlaceInitials();
  const [range, setRange] = useQueryState('range');

  const normalizedRange = React.useMemo(() => {
    const fallback = 'all_time';
    if (!range) return fallback;

    return KDR_RANGE_ITEMS.some((item) => item.value === range)
      ? range
      : fallback;
  }, [range]) as keyof KdrPlaceData;

  const title = 'K/D table';

  return (
    <>
      <Head>
        <title>{formatTitle(title, initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />
      </Head>

      <Layout>
        <Flex justifyContent="center">
          <Stack as="main" gap={4} maxWidth="2xl" width="100%">
            <KdrRangeSelect range={normalizedRange} setRange={setRange} />
            <KdrTable range={normalizedRange} />
          </Stack>
        </Flex>
      </Layout>
    </>
  );
}
