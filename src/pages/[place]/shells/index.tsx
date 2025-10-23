import { Flex } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import SearchLayout from '@/components/searchLayout/layout';
import ShellsSearchSidebar from '@/components/shells/searchSidebar';
import { EmptyState } from '@/components/ui/empty-state';
import Layout from '@/components/utils/layout';

export default function PlaceShells() {
  return (
    <Layout noPadding>
      <SearchLayout sidebar={<ShellsSearchSidebar />}>
        <Flex alignItems="center" height="100%">
          <EmptyState icon={<GrDocumentMissing />} title="No shell selected" />
        </Flex>
      </SearchLayout>
    </Layout>
  );
}
