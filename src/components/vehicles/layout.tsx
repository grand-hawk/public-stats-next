import { Box } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import CenterSpinner from '@/components/centerSpinner';
import VehicleSearch from '@/components/vehicles/search';
import { VEHICLE_SEARCH_INPUT_HEIGHT } from '@/components/vehicles/search/input';

import type { PropsWithChildren } from 'react';

export default function VehiclesLayout({ children }: PropsWithChildren) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        md: '22rem 1fr',
        lg: 'var(--chakra-sizes-sm) 1fr',
      }}
      gridTemplateRows={{
        base: '1fr',
        md: '1fr',
      }}
      height="100%"
      overflow="hidden"
      position="relative"
      width="100%"
    >
      <VehicleSearch />

      <Box
        as="main"
        marginBottom={{ base: VEHICLE_SEARCH_INPUT_HEIGHT, md: 0 }}
        overflow="auto"
      >
        <Suspense fallback={<CenterSpinner />}>{children}</Suspense>
      </Box>
    </Box>
  );
}
