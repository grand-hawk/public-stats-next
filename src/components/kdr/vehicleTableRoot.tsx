import { Box, Center } from '@chakra-ui/react';
import React from 'react';

import VehicleTable from '@/components/kdr/vehicleTable';
import PlaceEmptyState from '@/components/placeEmptyState';
import { useNavStore } from '@/stores/nav';

import type { BoxProps } from '@chakra-ui/react';

export default function VehicleTableRoot({ ...props }: BoxProps) {
  const placeId = useNavStore((s) => s.placeId);

  return (
    <Box
      borderColor="border.muted"
      borderRadius="lg"
      borderWidth="1px"
      padding={3}
      {...props}
    >
      <Center height="100%">
        {placeId ? <VehicleTable placeId={placeId} /> : <PlaceEmptyState />}
      </Center>
    </Box>
  );
}
