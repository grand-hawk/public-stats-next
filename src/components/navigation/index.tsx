import { Box, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import PlaceSelect from '@/components/navigation/placeSelect';
import NavigationTabs from '@/components/navigation/tabs';

export default function Navigation() {
  return (
    <Box
      as="nav"
      borderBottomColor="border.muted"
      borderBottomWidth="1px"
      display="flex"
      justifyContent="center"
      paddingX={{
        base: 2,
        sm: 4,
        // md: 8,
      }}
      paddingY={4}
    >
      <Box gap={4} width="100%">
        <Grid
          alignItems="center"
          gap={4}
          justifyContent="space-between"
          templateColumns="repeat(2, 1fr)"
        >
          <GridItem maxWidth="250px">
            <PlaceSelect noLabel />
          </GridItem>

          <GridItem>
            <NavigationTabs />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
