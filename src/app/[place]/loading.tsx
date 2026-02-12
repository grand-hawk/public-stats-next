'use client';

import React from 'react';

import { CenterSpinner } from '@/components/common/spinners';
import Layout from '@/components/layout/layout';

export default function PlaceLoading() {
  return (
    <Layout>
      <CenterSpinner />
    </Layout>
  );
}
