import { Box } from '@chakra-ui/react';
import React from 'react';

import Metadata from '@/components/kdr/metadata';
import VehicleTableRoot from '@/components/kdr/vehicleTableRoot';

export default function Kdr() {
  return (
    <Box
      display="grid"
      gridRowGap={4}
      gridTemplateColumns="1fr"
      gridTemplateRows="max-content 1fr"
    >
      <Metadata />

      <VehicleTableRoot />
    </Box>
  );
}
