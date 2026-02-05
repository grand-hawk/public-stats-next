import Head from 'next/head';
import React from 'react';

import ArmorVisualizer from '@/components/features/tools/armor/armorVisualizer';
import Layout from '@/components/layout/layout';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';

export default function ArmorPage() {
  const initials = usePlaceInitials();

  const title = 'Armor visualizer';

  return (
    <>
      <Head>
        <title>{formatTitle(title, initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />
      </Head>

      <Layout hidePlaceDropdown noPadding overwriteTabLabel="Armor visualizer">
        <ArmorVisualizer />
      </Layout>
    </>
  );
}
