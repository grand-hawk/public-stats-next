import { Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import { EmptyState } from '@/components/ui/empty-state';
import Layout from '@/components/utils/layout';
import VehiclesLayout from '@/components/vehicles/layout';
import VehicleAvailability from '@/components/vehicles/vehicle/availability';
import VehicleGeneralInformation from '@/components/vehicles/vehicle/generalInformation';
import VehicleHeader from '@/components/vehicles/vehicle/header';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { formatTitle } from '@/utils/formatTitle';
import { trpc } from '@/utils/trpc';

import type { WithContext, Vehicle } from 'schema-dts';

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

  // https://nextjs.org/docs/app/guides/json-ld
  // https://schema.org/Vehicle
  const jsonLd: WithContext<Vehicle> | null = vehicle
    ? {
        '@context': 'https://schema.org',
        '@type': 'Vehicle',
        name: vehicle.info.name,
      }
    : null;

  return (
    <>
      {vehicle && (
        <Head>
          <title>{formatTitle(vehicle.info.name, place.initials)}</title>
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
                as="article"
                gap={4}
                height="100%"
                maxWidth="3xl"
                width="100%"
              >
                {jsonLd && (
                  <script
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                    }}
                    type="application/ld+json"
                  />
                )}

                <VehicleHeader vehicle={vehicle} />
                <VehicleGeneralInformation
                  isAvailable={vehicleIsAvailable}
                  vehicle={vehicle}
                />
                <VehicleAvailability
                  availability={vehicleAvailability!}
                  isAvailable={vehicleIsAvailable}
                />
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
