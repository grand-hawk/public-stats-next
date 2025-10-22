import { Flex } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import SearchLayout from '@/components/searchLayout/layout';
import { EmptyState } from '@/components/ui/empty-state';
import Layout from '@/components/utils/layout';
import VehiclesSearchSidebar from '@/components/vehicles/searchSidebar';

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
