import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import VehiclesSearchSidebar from '@/components/features/vehicles/searchSidebar';
import Layout from '@/components/layout/layout';
import SearchLayout from '@/components/layout/searchLayout/layout';
import { EmptyState } from '@/components/ui/empty-state';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';

export default function PlaceVehicles() {
  const initials = usePlaceInitials()!;

  const title = 'Vehicles';

  return (
    <>
      <Head>
        <title>{formatTitle(title, initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />
      </Head>

      <Layout noPadding>
        <SearchLayout sidebar={<VehiclesSearchSidebar />}>
          <Flex alignItems="center" height="100%">
            <EmptyState
              icon={<GrDocumentMissing />}
              title="No vehicle selected"
            />
          </Flex>
        </SearchLayout>
      </Layout>
    </>
  );
}
