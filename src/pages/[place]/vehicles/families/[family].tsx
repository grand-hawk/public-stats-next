import React from 'react';
import slug from 'slug';

import VehicleFamily from '@/components/features/vehicles/family';
import ArticleNotFound from '@/components/layout/articleNotFound';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import Navbox from '@/components/wiki/navbox';
import { SectionMarkersProvider } from '@/hooks/providers/sectionMarkers';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { trpc } from '@/utils/trpc';

export default function PlaceVehicleFamily() {
  const familySlug = slug(useRouterQuery('family') ?? '');
  const place = usePlace()!;

  const [family] = trpc.vehicles.familyBySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: familySlug,
  });

  const title = family ? `${family.name} family` : 'Family not found';
  const description = family
    ? `Every ${family.name} in ${place.placeName}, with the models and derivatives of the design.`
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      <SectionMarkersProvider>
        <Layout noPadding>
          {family ? (
            <ArticlePage
              bandColor={family.teamColor}
              markdownTarget
              placeName={place.placeName}
              stickyTitle={family.name}
              titleId="vehicle-family-page-title"
            >
              <VehicleFamily family={family} />
              <Navbox group="vehicles" />
            </ArticlePage>
          ) : (
            <ArticleNotFound title="Family not found" />
          )}
        </Layout>
      </SectionMarkersProvider>
    </PageMeta>
  );
}
