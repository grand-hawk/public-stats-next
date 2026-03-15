import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import slug from 'slug';

import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { getVehicleImage } from '@/utils/getVehicleImage';

const ArmorVisualizer = dynamic(
  () => import('@/components/features/tools/armor/armorVisualizer'),
  { ssr: false },
);

export default function ArmorPage() {
  const router = useRouter();
  const vehicleQuery = router.query.vehicle;
  const vehicleSlug =
    typeof vehicleQuery === 'string' ? slug(vehicleQuery) : null;
  const ogImage = vehicleSlug
    ? getVehicleImage(vehicleSlug, 'armor_thumbnail')
    : undefined;

  return (
    <PageMeta
      ogImage={ogImage}
      title="Armour visualizer"
      twitterCard={ogImage ? 'summary_large_image' : undefined}
    >
      <Layout hidePlaceDropdown noPadding overwriteTabLabel="Armour visualizer">
        <ArmorVisualizer />
      </Layout>
    </PageMeta>
  );
}
