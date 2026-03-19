import { Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import stripMarkdown from 'remove-markdown';
import slug from 'slug';

import Vehicle from '@/components/features/vehicles';
import VehiclesSearchSidebar from '@/components/features/vehicles/searchSidebar';
import { getKeywords } from '@/components/layout/head';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import SearchLayout from '@/components/layout/searchLayout/layout';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionMarkersProvider } from '@/hooks/providers/sectionMarkers';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { getVehicleImage } from '@/utils/getVehicleImage';
import { trpc } from '@/utils/trpc';

export default function PlaceVehicle() {
  const vehicleQuery = useRouterQuery('vehicle')!;
  const vehicleSlug = slug(vehicleQuery);
  const place = usePlace()!;

  const [vehicle] = trpc.vehicles.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: vehicleSlug,
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

          {Object.entries(vehicle.linkedData).map(([key, linkedData]) => (
            <script
              key={key}
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(linkedData).replace(/</g, '\\u003c'),
              }}
              data-linked-data={key}
              type="application/ld+json"
            />
          ))}
        </Head>
      )}

      <SectionMarkersProvider>
        <Layout noPadding>
          <SearchLayout sidebar={<VehiclesSearchSidebar />}>
            {vehicle ? (
              <Flex
                justifyContent="center"
                marginBottom={{
                  base: 4,
                  md: 0,
                }}
                padding={{
                  base: 0,
                  md: 2,
                  lg: 4,
                }}
              >
                <Stack
                  aria-describedby="vehicle-page-description"
                  aria-labelledby="vehicle-page-title"
                  as="article"
                  gap={4}
                  maxWidth="4xl"
                  width="100%"
                  data-md-target
                >
                  <Vehicle vehicle={vehicle} />
                </Stack>
              </Flex>
            ) : (
              <Flex alignItems="center" height="100%">
                <EmptyState
                  icon={<GrDocumentMissing />}
                  title="Vehicle not found"
                />
              </Flex>
            )}
          </SearchLayout>
        </Layout>
      </SectionMarkersProvider>
    </PageMeta>
  );
}
