import Head from 'next/head';
import React from 'react';
import stripMarkdown from 'remove-markdown';
import slug from 'slug';

import PageActions from '@/components/common/pageActions';
import Vehicle from '@/components/features/vehicles';
import VehiclesSearchSidebar from '@/components/features/vehicles/searchSidebar';
import VehicleHeaderActions from '@/components/features/vehicles/vehicle/headerActions';
import { preloadVehicleBanner } from '@/components/features/vehicles/vehicleImage';
import ArticleNotFound from '@/components/layout/articleNotFound';
import ArticlePage from '@/components/layout/articlePage';
import { getKeywords } from '@/components/layout/head';
import Layout from '@/components/layout/layout';
import { linkedDataScripts } from '@/components/layout/linkedData';
import PageMeta from '@/components/layout/pageMeta';
import SearchLayout from '@/components/layout/searchLayout/layout';
import { SectionMarkersProvider } from '@/hooks/providers/sectionMarkers';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useSwapSlug } from '@/hooks/useSwapSlug';
import { getVehicleImage } from '@/utils/getVehicleImage';
import { trpc } from '@/utils/trpc';

export default function PlaceVehicle() {
  const vehicleQuery = useRouterQuery('vehicle')!;
  const vehicleSlug = slug(vehicleQuery);
  const place = usePlace()!;

  const utils = trpc.useUtils();
  const { isStale, shownSlug: deferredSlug } = useSwapSlug(
    vehicleSlug,
    (nextSlug) =>
      Promise.all([
        utils.vehicles.bySlug.prefetch({
          placeId: place.placeId,
          slug: nextSlug,
        }),
        preloadVehicleBanner(nextSlug),
      ]),
  );

  const [vehicle] = trpc.vehicles.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: deferredSlug,
  });

  const title = vehicle ? vehicle.info.name : 'Vehicle not found';
  const image = vehicle ? getVehicleImage(vehicle.info.slug) : null;
  const descriptionQuote =
    vehicle &&
    vehicle.info.description &&
    `"${vehicle.content?.Description ? stripMarkdown(vehicle.content.Description) : vehicle.info.description}"`;

  return (
    <PageMeta
      title={title}
      description={
        vehicle
          ? `${vehicle.info.name} from Multicrew Tank Combat` +
            (descriptionQuote ? `\n\n${descriptionQuote}` : '')
          : undefined
      }
      ogDescription={descriptionQuote || undefined}
      twitterCard={vehicle && image ? 'summary_large_image' : undefined}
    >
      {vehicle?.info.unlisted && (
        <Head>
          <meta content="noindex" name="robots" />
        </Head>
      )}

      {vehicle && image && (
        <Head>
          <meta
            content={[
              'Vehicle',
              vehicle.info.type,
              vehicle.info.name,
              ...getKeywords(place),
            ].join(',')}
            name="keywords"
          />

          <meta content={image} property="og:image" />
          <meta
            content={`image/${image.split('.').pop()}`}
            property="og:image:type"
          />
          <meta content={image} name="twitter:image" />

          {linkedDataScripts(vehicle.linkedData)}
        </Head>
      )}

      <SectionMarkersProvider>
        <Layout noPadding>
          <SearchLayout sidebar={<VehiclesSearchSidebar />}>
            {vehicle ? (
              <ArticlePage
                actions={
                  <PageActions iconOnly>
                    <VehicleHeaderActions vehicle={vehicle} />
                  </PageActions>
                }
                bandColor={vehicle.info.teamColor}
                bandImage={image ?? undefined}
                describedBy="vehicle-page-description"
                markdownTarget
                placeName={place.placeName}
                stickyTitle={vehicle.info.name}
                swapId={vehicle.info.slug}
                swapStale={isStale}
                titleId="vehicle-page-title"
              >
                <Vehicle vehicle={vehicle} />
              </ArticlePage>
            ) : (
              <ArticleNotFound title="Vehicle not found" />
            )}
          </SearchLayout>
        </Layout>
      </SectionMarkersProvider>
    </PageMeta>
  );
}
