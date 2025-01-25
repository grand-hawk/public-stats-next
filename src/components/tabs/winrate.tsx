import { Box } from '@chakra-ui/react';
import React from 'react';

import Filters from '@/components/winrate/filters';
import WinrateChartRoot from '@/components/winrate/winrateChartRoot';

export function WinrateTab() {
  return (
    <Box
      display="grid"
      gridRowGap={4}
      gridTemplateColumns="1fr"
      gridTemplateRows="max-content 1fr"
    >
      <Filters grow />

      <WinrateChartRoot />
    </Box>
  );
}
