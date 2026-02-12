'use client';

import React from 'react';

import ShellsSearchSidebar from '@/components/features/shells/searchSidebar';
import Layout from '@/components/layout/layout';
import SearchLayout from '@/components/layout/searchLayout/layout';

export default function ShellsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout noPadding>
      <SearchLayout sidebar={<ShellsSearchSidebar />}>
        {children}
      </SearchLayout>
    </Layout>
  );
}
