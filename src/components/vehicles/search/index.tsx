import { Box } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import CenterSpinner from '@/components/centerSpinner';
import VehicleSearchConfig from '@/components/vehicles/search/config';
import VehicleSearchInput, {
  VEHICLE_SEARCH_INPUT_HEIGHT,
} from '@/components/vehicles/search/input';
import VehicleSearchList from '@/components/vehicles/search/list';
import { useVehicleSidebarStore } from '@/stores/vehicles/sidebar';

export default function VehicleSearch() {
  const isOpen = useVehicleSidebarStore((s) => s.open);

  return (
    <Box
      as="aside"
      backgroundColor="bg"
      borderRightWidth={{ base: 0, md: '1px' }}
      bottom={0}
      display="grid"
      gridTemplateRows="max-content 1fr"
      height={{
        base: isOpen ? '100%' : VEHICLE_SEARCH_INPUT_HEIGHT,
        md: 'unset',
      }}
      left={0}
      overflow="hidden"
      position={{ base: 'absolute', md: 'unset' }}
      role="search"
      transition="height 0.3s ease-in-out"
      width={{ base: '100%', md: 'unset' }}
      zIndex={{ base: 100, md: 'unset' }}
    >
      <div>
        <VehicleSearchInput />
        <VehicleSearchConfig />
      </div>

      <Suspense fallback={<CenterSpinner />}>
        <VehicleSearchList />
      </Suspense>
    </Box>
  );
}
