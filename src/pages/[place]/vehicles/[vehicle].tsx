import { Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import { EmptyState } from '@/components/ui/empty-state';
import Layout from '@/components/utils/layout';
import VehiclesLayout from '@/components/vehicles/layout';
import VehicleAvailability from '@/components/vehicles/vehicle/availability';
import VehicleDynamicData from '@/components/vehicles/vehicle/dynamic';
import VehicleGeneralInformation from '@/components/vehicles/vehicle/generalInformation';
import VehicleHeader from '@/components/vehicles/vehicle/header';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { formatTitle } from '@/utils/formatTitle';
import { trpc } from '@/utils/trpc';

export default function PlaceVehicle() {
  const vehicleSlug = useRouterQuery('vehicle')!.toLowerCase();
  const place = usePlace()!;

  const [vehicle] = trpc.vehicles.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: vehicleSlug,
  });
  const [vehicleAvailability] =
    trpc.loadouts.vehicleAvailability.useSuspenseQuery({
      placeId: place.placeId,
      slug: vehicleSlug,
    });
  const vehicleIsAvailable =
    !!vehicleAvailability && Object.keys(vehicleAvailability).length > 0;

  const title = vehicle && formatTitle(vehicle.info.name, place.initials);

  return (
    <>
      {vehicle && (
        <Head>
          <title>{title!}</title>

          <meta content="website" property="og:type" />
          <meta content="index,follow" name="robots" />
          <meta content="summary_large_image" name="twitter:card" />

          <meta content={title!} property="og:site_name" />
          <meta content={vehicle.info.name} property="og:title" />
          <meta content={vehicle.info.name!} name="twitter:title" />

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
        </Head>
      )}

      <Layout noPadding>
        <VehiclesLayout>
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
                aria-labelledby="vehicle-page-title"
                as="article"
                gap={4}
                maxWidth="4xl"
                width="100%"
              >
                <VehicleHeader vehicle={vehicle} />
                <VehicleGeneralInformation
                  isAvailable={vehicleIsAvailable}
                  vehicle={vehicle}
                />
                <VehicleAvailability
                  availability={vehicleAvailability!}
                  isAvailable={vehicleIsAvailable}
                />
                <VehicleDynamicData key={vehicle.info.slug} vehicle={vehicle} />
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
        </VehiclesLayout>
      </Layout>
    </>
  );
}
