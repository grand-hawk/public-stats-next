import { Box, Center } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import PlaceEmptyState from '@/components/states/placeEmptyState';
import { useNavigationStore } from '@/stores/navigation';

import type { BoxProps } from '@chakra-ui/react';

const WinrateChart = dynamic(
  () => import('@/components/winrate/winrateChart'),
  { ssr: false },
);

export default function WinrateChartRoot({ ...props }: BoxProps) {
  const placeId = useNavigationStore((s) => s.placeId);

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
