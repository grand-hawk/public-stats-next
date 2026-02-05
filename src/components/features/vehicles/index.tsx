import { Box, Stack } from '@chakra-ui/react';
import React from 'react';

import { ContextCapturer } from '@/components/development/contextCapturer';
import VehicleAvailability from '@/components/features/vehicles/vehicle/availability';
import VehicleDataInfo from '@/components/features/vehicles/vehicle/dataInfo';
import VehicleDynamicData from '@/components/features/vehicles/vehicle/dynamic';
import SectionNavigation from '@/components/features/vehicles/vehicle/dynamic/sectionNavigation';
import VehicleDynamicSidebar from '@/components/features/vehicles/vehicle/dynamic/sidebar';
import VehicleGallery from '@/components/features/vehicles/vehicle/gallery';
import VehicleGeneralInformation from '@/components/features/vehicles/vehicle/generalInformation';
import VehicleHeader from '@/components/features/vehicles/vehicle/header';
import InaccurateDataFooter from '@/components/wiki/inaccurateDataFooter';
import { DynamicDataProvider } from '@/hooks/providers/dynamicData';
import { VehicleContext } from '@/hooks/providers/vehicle';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function Vehicle({ vehicle }: { vehicle: DetailedVehicle }) {
  const vehicleIsAvailable =
    !!vehicle.info.availability &&
    Object.keys(vehicle.info.availability).length > 0;

  const hasSidebarContent =
    Object.keys(vehicle.alterations.loadouts).length > 0 ||
    Object.keys(vehicle.alterations.addons).length > 0;

  return (
    <VehicleContext.Provider value={vehicle}>
      <ContextCapturer contextKey="Vehicle" data={vehicle} />

      <DynamicDataProvider>
        <VehicleHeader />

        <Box
          display="grid"
          gap={4}
          gridTemplateColumns={{
            base: 'minmax(0, 1fr)',
            '2xl': 'minmax(0, 1fr) var(--chakra-sizes-xs)',
          }}
          width="100%"
        >
          <Stack
            as="aside"
            gap={4}
            gridColumn="2"
            gridRow="1"
            hideBelow="2xl"
            maxHeight="max-content"
            position="sticky"
            top={4}
          >
            <SectionNavigation />
            <VehicleDynamicSidebar />
            <VehicleDataInfo />
          </Stack>

          <Stack gap={4} minW="0">
            <VehicleGeneralInformation isAvailable={vehicleIsAvailable} />
            <VehicleAvailability
              availability={vehicle.info.availability}
              isAvailable={vehicleIsAvailable}
            />
            {hasSidebarContent && (
              <Stack hideFrom="2xl" gap={4} minW="0">
                <VehicleDynamicSidebar />
              </Stack>
            )}
            <VehicleDynamicData />
            <VehicleGallery />
            <Box hideFrom="2xl">
              <VehicleDataInfo compact />
            </Box>
            <InaccurateDataFooter />
          </Stack>
        </Box>
      </DynamicDataProvider>
    </VehicleContext.Provider>
  );
}
