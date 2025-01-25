import Head from 'next/head';
import React from 'react';

import Layout from '@/components/utils/layout';
import Umami from '@/components/utils/umami';
import { TabPanelPortalContext } from '@/hooks/tabPanelPortalContext';

export default function Index() {
  const tabContentRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Head>
        <title>MTC Stats</title>
      </Head>

      <TabPanelPortalContext.Provider value={tabContentRef}>
        <Layout>
          <div ref={tabContentRef} />
        </Layout>
      </TabPanelPortalContext.Provider>

      <Umami />
    </>
  );
}
