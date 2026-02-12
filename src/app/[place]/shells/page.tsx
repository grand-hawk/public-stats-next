'use client';

import { Flex } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import ShellsSearchSidebar from '@/components/features/shells/searchSidebar';
import Layout from '@/components/layout/layout';
import SearchLayout from '@/components/layout/searchLayout/layout';
import { EmptyState } from '@/components/ui/empty-state';

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
