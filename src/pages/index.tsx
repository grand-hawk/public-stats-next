import Head from 'next/head';
import React from 'react';

import PlaceSelect from '@/components/placeSelect';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/utils/layout';
import VehicleTableRoot from '@/components/vehicleTableRoot';

export default function Index() {
  return (
    <>
      <Head>
        <title>Vehicle KDR</title>
      </Head>

      <Layout>
        <PlaceSelect />
        <VehicleTableRoot />
      </Layout>

      <Toaster />
    </>
  );
}
