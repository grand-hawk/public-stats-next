import { Grid, GridItem, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

import PlaceSelect from '@/components/placeSelect';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/utils/layout';
import VehicleTableRoot from '@/components/vehicleTableRoot';
import VersionsIncluded from '@/components/versionsIncluded';

export default function Index() {
  return (
    <>
      <Head>
        <title>Vehicle KDR</title>
      </Head>

      <Layout>
        <Stack gap={4}>
          <Grid gap={4} templateColumns="repeat(2, 1fr)">
            <GridItem>
              <PlaceSelect />
            </GridItem>

            <GridItem>
              <VersionsIncluded />
            </GridItem>
          </Grid>
        </Stack>

        <VehicleTableRoot />
      </Layout>

      <Toaster />
    </>
  );
}
