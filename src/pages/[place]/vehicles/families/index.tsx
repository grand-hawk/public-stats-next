import React from 'react';

import VehicleFamilies from '@/components/features/vehicles/families';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import Navbox from '@/components/wiki/navbox';
import { SectionMarkersProvider } from '@/hooks/providers/sectionMarkers';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

export default function PlaceVehicleFamilies() {
  const place = usePlace()!;

  const [families] = trpc.vehicles.families.useSuspenseQuery({
    placeId: place.placeId,
  });

  return (
    <PageMeta
      title="Vehicle families"
      description={`Every vehicle family in ${place.placeName}, and the vehicles that belong to each one.`}
    >
      <SectionMarkersProvider>
        <Layout noPadding>
          <ArticlePage
            markdownTarget
            placeName={place.placeName}
            stickyTitle="Vehicle families"
            titleId="vehicle-families-page-title"
          >
            <VehicleFamilies families={families} />
            <Navbox group="vehicles" />
          </ArticlePage>
        </Layout>
      </SectionMarkersProvider>
    </PageMeta>
  );
}
