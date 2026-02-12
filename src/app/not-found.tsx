'use client';

import React from 'react';
import { LuSearchX } from 'react-icons/lu';

import Layout from '@/components/layout/layout';
import { EmptyState } from '@/components/ui/empty-state';

export default function NotFound() {
  return (
    <Layout hidePlaceSelector>
      <EmptyState
        description="The page you are looking for does not exist."
        icon={<LuSearchX />}
        title="Page not found"
      />
    </Layout>
  );
}
