import { Box, Center } from '@chakra-ui/react';
import React from 'react';

import PlaceEmptyState from '@/components/placeEmptyState';
import WinrateChart from '@/components/winrate/winrateChart';
import { usePlaceSelectStore } from '@/stores/placeSelect';

import type { BoxProps } from '@chakra-ui/react';

export default function WinrateChartRoot({ ...props }: BoxProps) {
  const placeId = usePlaceSelectStore((s) => s.placeId);

  return (
    <Box
      borderColor="border.muted"
      borderRadius="lg"
      borderWidth="1px"
      padding={3}
      {...props}
    >
      <Center height="100%">
        {placeId ? <WinrateChart placeId={placeId} /> : <PlaceEmptyState />}
      </Center>
    </Box>
  );
}
