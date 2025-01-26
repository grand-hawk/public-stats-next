import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

import Metadata from '@/components/kdr/metadata';
import VehicleTableRoot from '@/components/kdr/vehicleTableRoot';

export default function Kdr() {
  return (
    <>
      <Head>
        <title>K/D Ratio - MTC Stats</title>
      </Head>

      <Box
        display="grid"
        gridRowGap={4}
        gridTemplateColumns="1fr"
        gridTemplateRows="max-content 1fr"
      >
        <Metadata />

        <VehicleTableRoot />
      </Box>
    </>
  );
}
