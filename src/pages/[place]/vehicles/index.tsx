import React from 'react';

import VehiclesSearch from '@/components/features/vehicles/browse';
import Layout from '@/components/layout/layout';

export default function PlaceVehicles() {
  return (
    <Layout noPadding>
      <VehiclesSearch />
    </Layout>
  );
}
