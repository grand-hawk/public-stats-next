import { useRouter } from 'next/router';
import React from 'react';

import VehiclesSearch from '@/components/features/vehicles/browse';
import { findVehicleClassCategory } from '@/components/features/vehicles/classCategories';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { usePlace } from '@/hooks/usePlace';

export default function PlaceVehiclesByClass() {
  const router = useRouter();
  const place = usePlace();

  const classSlug =
    typeof router.query.class === 'string' ? router.query.class : '';
  const category = findVehicleClassCategory(classSlug);

  React.useEffect(() => {
    if (!router.isReady || !place) return;
    if (!category) router.replace(`/${place.initials}/vehicles`);
  }, [category, place, router]);

  if (!place || !category) return null;

  return (
    <PageMeta
      exactTitle={`${category.label} vehicles - ${place.placeName}`}
      description={`Browse all ${category.label.toLowerCase()} vehicles in ${place.placeName}: ${category.description}`}
    >
      <Layout noPadding>
        <VehiclesSearch defaultClassifications={[category.name]} />
      </Layout>
    </PageMeta>
  );
}
