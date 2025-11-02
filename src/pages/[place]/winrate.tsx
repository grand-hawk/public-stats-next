import { Code, Flex, Span, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import { Alert } from '@/components/ui/alert';
import Layout from '@/components/utils/layout';
import WinrateChartRoot from '@/components/winrate/chart/root';
import WinrateFilters from '@/components/winrate/filters';

export default function PlaceWinrate() {
  return (
    <Layout>
      <Flex justifyContent="center">
        <Stack as="main" gap={4} maxWidth="2xl" width="100%">
          <Alert
            background="bg.subtle"
            borderStartColor="blue.600"
            borderStartWidth={4}
            colorPalette="gray"
            startElement
          >
            <Text>
              Daily team winrate (not cumulative). For each day, the winner is
              the team with the highest final score (ties pick the first).{' '}
              <Span whiteSpace="nowrap">
                Winrate = <Code>wins / games x 100</Code>
              </Span>{' '}
              for that day.
            </Text>
          </Alert>

          <WinrateFilters />
          <WinrateChartRoot />
        </Stack>
      </Flex>
    </Layout>
  );
}
