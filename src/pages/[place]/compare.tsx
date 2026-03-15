import React from 'react';

import VehicleComparison from '@/components/features/compare';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';

export default function ComparePage() {
  return (
    <PageMeta title="Compare">
      <Layout noPadding>
        <VehicleComparison />
      </Layout>
    </PageMeta>
  );
}
