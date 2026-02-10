import { Flex } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import VehiclesSearchSidebar from '@/components/features/vehicles/searchSidebar';
import Layout from '@/components/layout/layout';
import SearchLayout from '@/components/layout/searchLayout/layout';
import { EmptyState } from '@/components/ui/empty-state';

export default function PlaceVehicles() {
  return (
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
  );
}
