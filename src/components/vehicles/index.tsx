import { Box, Stack } from '@chakra-ui/react';
import React from 'react';

import { ContextCapturer } from '@/components/development/contextCapturer';
import VehicleAvailability from '@/components/vehicles/vehicle/availability';
import VehicleDynamicData from '@/components/vehicles/vehicle/dynamic';
import SectionNavigation from '@/components/vehicles/vehicle/dynamic/sectionNavigation';
import VehicleDynamicSidebar from '@/components/vehicles/vehicle/dynamic/sidebar';
import VehicleGeneralInformation from '@/components/vehicles/vehicle/generalInformation';
import VehicleHeader from '@/components/vehicles/vehicle/header';
import { DynamicDataProvider } from '@/hooks/providers/dynamicData';
import { VehicleContext } from '@/hooks/providers/vehicle';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function Vehicle({ vehicle }: { vehicle: DetailedVehicle }) {
  const vehicleIsAvailable =
    !!vehicle.info.availability &&
    Object.keys(vehicle.info.availability).length > 0;

  return (
    <VehicleContext.Provider value={vehicle}>
      <ContextCapturer contextKey="Vehicle" data={vehicle} />

      <DynamicDataProvider>
        <VehicleHeader />

        <Box
          display="grid"
          gap={4}
          gridTemplateColumns={{
            base: '1fr',
            xl: '1fr var(--chakra-sizes-xs)',
          }}
          width="100%"
        >
          <Stack
            as="aside"
            gap={4}
            gridColumn={{ base: 'unset', xl: '2' }}
            gridRow={{ base: 'unset', xl: '1' }}
            maxHeight="max-content"
            position={{ base: 'unset', xl: 'sticky' }}
            top={4}
          >
            <SectionNavigation />
            <VehicleDynamicSidebar />
          </Stack>

          <Stack gap={4}>
            <VehicleGeneralInformation isAvailable={vehicleIsAvailable} />
            <VehicleAvailability
              availability={vehicle.info.availability}
              isAvailable={vehicleIsAvailable}
            />
            <VehicleDynamicData />
          </Stack>
        </Box>
      </DynamicDataProvider>
    </VehicleContext.Provider>
  );
}
