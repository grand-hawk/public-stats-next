import { Box, Grid, GridItem, Stack } from '@chakra-ui/react';
import React from 'react';

import Metadata from '@/components/kdr/metadata';
import VehicleTableRoot from '@/components/kdr/vehicleTableRoot';

export function KdrTab() {
  return (
    <Box
      display="grid"
      gridRowGap={4}
      gridTemplateColumns="1fr"
      gridTemplateRows="max-content 1fr"
      maxWidth="600px"
      width="100%"
    >
      <Stack gap={4}>
        <Grid gap={4} templateColumns="repeat(2, 1fr)">
          <GridItem>
            <Metadata />
          </GridItem>
        </Grid>
      </Stack>

      <VehicleTableRoot />
    </Box>
  );
}
