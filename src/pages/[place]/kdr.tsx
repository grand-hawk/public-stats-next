import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import KdrTable from '@/components/kdr/table';
import Layout from '@/components/utils/layout';

export default function PlaceKdr() {
  return (
    <Layout>
      <Flex
        justifyContent="center"
        marginBottom={{
          base: 4,
          md: 0,
        }}
        padding={{
          base: 0,
          md: 2,
          lg: 4,
        }}
      >
        <Box as="main" maxWidth="2xl" width="100%">
          <KdrTable />
        </Box>
      </Flex>
    </Layout>
  );
}
