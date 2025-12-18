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
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { formatTitle } from '@/utils/formatTitle';
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

  return (
    <>
      <Head>
        <title>{formatTitle(title, place.initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />

        {vehicle && (
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

            {vehicle.info.image && (
              <>
                <meta content={vehicle.info.image} property="og:image" />
                <meta content="1920" property="og:image:width" />
                <meta content="1080" property="og:image:height" />
                <meta
                  content={`image/${vehicle.info.image.split('.').pop()}`}
                  property="og:image:type"
                />

                <meta content={vehicle.info.image} name="twitter:image" />
              </>
            )}

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
    </>
  );
}
