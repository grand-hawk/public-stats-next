import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import SearchLayout from '@/components/searchLayout/layout';
import { EmptyState } from '@/components/ui/empty-state';
import Layout from '@/components/utils/layout';
import VehiclesSearchSidebar from '@/components/vehicles/searchSidebar';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';

export default function PlaceVehicles() {
  const initials = usePlaceInitials()!;

  return (
    <>
      <Head>
        <title>{formatTitle('Vehicles', initials)}</title>
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
