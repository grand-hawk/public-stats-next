import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';

import KdrRangeSelect from '@/components/kdr/rangeSelect';
import KdrTable from '@/components/kdr/table';
import Layout from '@/components/utils/layout';

import type { KdrPlaceData } from '@generated/kdr';

export default function PlaceKdr() {
  const [range, setRange] = React.useState<keyof KdrPlaceData>('all_time');

  return (
    <Layout>
      <Flex justifyContent="center">
        <Stack as="main" gap={4} maxWidth="2xl" width="100%">
          <KdrRangeSelect range={range} setRange={setRange} />
          <KdrTable range={range} />
        </Stack>
      </Flex>
    </Layout>
  );
}
