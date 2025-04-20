import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import PlaceEmptyState from '@/components/states/placeEmptyState';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '@/components/ui/breadcrumb';
import VehicleInfo from '@/components/vehicles/info';
import { useNavigationStore } from '@/stores/navigation';

export default function Vehicle() {
  const router = useRouter();
  const placeId = useNavigationStore((s) => s.placeId);
  const rawSlug = router.query.slug;

  const isCorrectSlug = typeof rawSlug === 'object' && rawSlug.length === 1;
  const vehicle = isCorrectSlug && decodeURIComponent(rawSlug[0]);

  return (
    <>
      <Head>
        <title>{`${vehicle} - MTC Stats`}</title>
      </Head>

      {vehicle && (
        <Box
          display="grid"
          gridRowGap={4}
          gridTemplateColumns="1fr"
          gridTemplateRows="max-content 1fr"
        >
          <BreadcrumbRoot>
            <NextLink href="/vehicles" passHref>
              <BreadcrumbLink as="span">Search</BreadcrumbLink>
            </NextLink>

            <BreadcrumbCurrentLink as="span">{vehicle}</BreadcrumbCurrentLink>
          </BreadcrumbRoot>

          {placeId ? (
            <VehicleInfo placeId={placeId} vehicle={vehicle} />
          ) : (
            <PlaceEmptyState />
          )}
        </Box>
      )}
    </>
  );
}
