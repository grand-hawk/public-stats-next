import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import SearchLayout from '@/components/searchLayout/layout';
import ShellsSearchSidebar from '@/components/shells/searchSidebar';
import { EmptyState } from '@/components/ui/empty-state';
import Layout from '@/components/utils/layout';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';

export default function PlaceShells() {
  const initials = usePlaceInitials()!;

  const title = 'Shells';

  return (
    <>
      <Head>
        <title>{formatTitle(title, initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />
      </Head>

      <Layout noPadding>
        <SearchLayout sidebar={<ShellsSearchSidebar />}>
          <Flex alignItems="center" height="100%">
            <EmptyState
              icon={<GrDocumentMissing />}
              title="No shell selected"
            />
          </Flex>
        </SearchLayout>
      </Layout>
    </>
  );
}
