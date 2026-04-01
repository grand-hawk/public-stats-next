import React from 'react';

import ShellsSearch from '@/components/features/shells/browse';
import Layout from '@/components/layout/layout';

export default function PlaceShells() {
  return (
    <Layout noPadding>
      <ShellsSearch />
    </Layout>
  );
}
