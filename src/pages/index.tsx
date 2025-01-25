import { Grid, GridItem, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

import Metadata from '@/components/metadata';
import PlaceSelect from '@/components/placeSelect';
import Layout from '@/components/utils/layout';
import Umami from '@/components/utils/umami';
import VehicleTableRoot from '@/components/vehicleTableRoot';

export default function Index() {
  return (
    <>
      <Head>
        <title>MTC Stats</title>
      </Head>

      <Layout>
        <Stack gap={4}>
          <Grid gap={4} templateColumns="repeat(2, 1fr)">
            <GridItem>
              <PlaceSelect />
            </GridItem>

            <GridItem>
              <Metadata />
            </GridItem>
          </Grid>
        </Stack>

        <VehicleTableRoot />
      </Layout>

      <Umami />
    </>
  );
}
