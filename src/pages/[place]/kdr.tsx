import { Box } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import React from 'react';

import KdrRangeSelect, {
  KDR_RANGE_ITEMS,
} from '@/components/features/kdr/rangeSelect';
import KdrTable from '@/components/features/kdr/table';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import ArticleTitle from '@/components/wiki/articleTitle';
import { usePlace } from '@/hooks/usePlace';

import type { KdrPlaceData } from '@generated/kdr';

const TABLE_MEASURE = '720px';

export default function PlaceKdr() {
  const place = usePlace()!;
  const [range, setRange] = useQueryState('range');

  const normalizedRange = (
    range && KDR_RANGE_ITEMS.some((item) => item.value === range)
      ? range
      : 'all_time'
  ) as keyof KdrPlaceData;

  return (
    <Layout noPadding>
      <ArticlePage placeName={place.placeName} titleId="kdr-page-title">
        <Box maxWidth={TABLE_MEASURE} width="100%">
          <ArticleTitle
            actions={
              <KdrRangeSelect range={normalizedRange} setRange={setRange} />
            }
            id="kdr-page-title"
            title="K/D table"
          />

          <KdrTable range={normalizedRange} />
        </Box>
      </ArticlePage>
    </Layout>
  );
}
