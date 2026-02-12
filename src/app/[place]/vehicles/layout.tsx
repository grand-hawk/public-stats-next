'use client';

import React from 'react';

import VehiclesSearchSidebar from '@/components/features/vehicles/searchSidebar';
import Layout from '@/components/layout/layout';
import SearchLayout from '@/components/layout/searchLayout/layout';

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout noPadding>
      <SearchLayout sidebar={<VehiclesSearchSidebar />}>
        {children}
      </SearchLayout>
    </Layout>
  );
}
