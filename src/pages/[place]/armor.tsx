import dynamic from 'next/dynamic';
import React from 'react';

import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';

const ArmorVisualizer = dynamic(
  () => import('@/components/features/tools/armor/armorVisualizer'),
  { ssr: false },
);

export default function ArmorPage() {
  return (
    <PageMeta title="Armour visualizer">
      <Layout hidePlaceDropdown noPadding overwriteTabLabel="Armour visualizer">
        <ArmorVisualizer />
      </Layout>
    </PageMeta>
  );
}
