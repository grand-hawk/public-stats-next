'use client';

import React from 'react';

import ArmorVisualizer from '@/components/features/tools/armor/armorVisualizer';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';

export default function ArmorPage() {
  return (
    <PageMeta title="Armor visualizer">
      <Layout hidePlaceDropdown noPadding overwriteTabLabel="Armor visualizer">
        <ArmorVisualizer />
      </Layout>
    </PageMeta>
  );
}
