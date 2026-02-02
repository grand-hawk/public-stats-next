import { Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slug from 'slug';

import SearchLayout from '@/components/searchLayout/layout';
import { EmptyState } from '@/components/ui/empty-state';
import { getKeywords } from '@/components/utils/head';
import Layout from '@/components/utils/layout';
import Vehicle from '@/components/vehicles';
import VehiclesSearchSidebar from '@/components/vehicles/searchSidebar';
import InaccurateDataFooter from '@/components/wiki/inaccurateDataFooter';
import { SectionMarkersProvider } from '@/hooks/providers/sectionMarkers';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { formatTitle } from '@/utils/formatTitle';
import { getVehicleImage } from '@/utils/getVehicleImage';
import { trpc } from '@/utils/trpc';

export default function PlaceVehicle() {
  const router = useRouter();
  const vehicleQuery = useRouterQuery('vehicle')!;
  const vehicleSlug = slug(vehicleQuery);
  const place = usePlace()!;

  const [vehicle] = trpc.vehicles.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: vehicleSlug,
  });

  React.useEffect(() => {
    if (!vehicle) return;

    if (vehicleQuery !== vehicleSlug)
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          vehicle: vehicleSlug,
        },
      });
  }, [router, vehicle, vehicleQuery, vehicleSlug]);

  const title = vehicle ? vehicle.info.name : 'Vehicle not found';
  const image = vehicle ? getVehicleImage(vehicle.info.slug) : null;

  return (
    <>
      <Head>
        <title>{formatTitle(title, place.initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />

        {/* Image is just here for type safety */}
        {vehicle && image && (
          <>
            <meta content="summary_large_image" name="twitter:card" />
            <meta
              content={[
                ...(
                  (vehicle.linkedData.vehicle?.keywords as
                    | string
                    | undefined) || ''
                ).split(','),
                vehicle.info.name,
                ...getKeywords(place),
              ].join(',')}
              name="keywords"
            />

            <meta
              content={
                `${vehicle.info.name} from Multicrew Tank Combat` +
                (vehicle.info.description
                  ? `\n\n“${vehicle.info.description}”`
                  : '')
              }
              name="description"
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
          </>
        )}
      </Head>

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
                  maxWidth="5xl"
                  width="100%"
                  data-md-target
                >
                  <Vehicle vehicle={vehicle} />

                  <InaccurateDataFooter />
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
    </>
  );
}
