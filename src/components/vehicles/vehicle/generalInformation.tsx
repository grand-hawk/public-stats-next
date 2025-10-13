import { Box } from '@chakra-ui/react';
import React from 'react';

import Stat from '@/components/stat';
import TitledCard from '@/components/titledCard';
import { capitalizeFirst } from '@/utils/capitalizeFirst';

import type { NamedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function VehicleGeneralInformation({
  vehicle,
}: {
  vehicle: NamedVehicle;
}) {
  return (
    <TitledCard as="section" title="General information">
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(var(--chakra-sizes-3xs), 1fr))"
      >
        <Stat label="Locomotion">
          {capitalizeFirst(vehicle.info.locomotion)}
        </Stat>

        {vehicle.info.amphibious && <Stat label="Amphibious">Yes</Stat>}

        {vehicle.info.premium && (
          <Stat label="Premium">
            Yes
            {vehicle.info.premium === true
              ? ', coins'
              : vehicle.info.premium === 'shop'
                ? ', shop'
                : ', badge'}
          </Stat>
        )}

        {vehicle.info.supportedClasses.length > 0 && (
          <Stat label="Supported classes">
            {capitalizeFirst(
              vehicle.info.supportedClasses.join(', ').toLowerCase(),
            )}
          </Stat>
        )}
      </Box>
    </TitledCard>
  );
}
