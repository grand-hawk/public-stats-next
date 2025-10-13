import { Flex } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import { EmptyState } from '@/components/ui/empty-state';
import Layout from '@/components/utils/layout';
import VehiclesLayout from '@/components/vehicles/layout';

export default function PlaceVehicles() {
  return (
    <Layout noPadding>
      <VehiclesLayout>
        <Flex alignItems="center" height="100%">
          <EmptyState
            icon={<GrDocumentMissing />}
            title="No vehicle selected"
          />
        </Flex>
      </VehiclesLayout>
    </Layout>
  );
}
