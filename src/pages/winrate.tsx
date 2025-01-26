import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

import Filters from '@/components/winrate/filters';
import WinrateChartRoot from '@/components/winrate/winrateChartRoot';

export default function WinrateTab() {
  return (
    <>
      <Head>
        <title>Winrate - MTC Stats</title>
      </Head>

      <Box
        display="grid"
        gridRowGap={4}
        gridTemplateColumns="1fr"
        gridTemplateRows="max-content 1fr"
      >
        <Filters grow />

        <WinrateChartRoot />
      </Box>
    </>
  );
}
