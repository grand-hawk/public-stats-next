import { Box, FormatNumber } from '@chakra-ui/react';
import React from 'react';

import Stat from '@/components/stat';
import TitledCard from '@/components/vehicles/titledCard';
import { capitalizeFirst } from '@/utils/capitalizeFirst';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function VehicleGeneralInformation({
  isAvailable,
  vehicle,
}: {
  vehicle: DetailedVehicle;
  isAvailable: boolean;
}) {
  return (
    <TitledCard as="section" title="General information" withAnchor>
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(var(--chakra-sizes-3xs), 1fr))"
      >
        <Stat label="Locomotion">
          {capitalizeFirst(vehicle.info.locomotion)}
        </Stat>

        {vehicle.info.amphibious && <Stat label="Amphibious">Yes</Stat>}

        <Stat label="Obtainment">
          {isAvailable
            ? vehicle.info.premium === false
              ? 'Free'
              : vehicle.info.premium === true
                ? 'Premium'
                : vehicle.info.premium === 'shop'
                  ? 'Shop'
                  : 'Badge'
            : 'Dev-spawner only'}
        </Stat>

        {vehicle.info.premiumPrice !== undefined && (
          <Stat label="Price">
            <FormatNumber value={vehicle.info.premiumPrice} />{' '}
            {/* premiumPrice will only be present for `true` and `shop` */}
            {vehicle.info.premium === true ? 'coins' : 'money'}
          </Stat>
        )}

        {vehicle.info.supportedClasses.length > 0 && (
          <Stat label="Supported classes">
            {vehicle.info.supportedClasses.join(', ')}
          </Stat>
        )}
      </Box>
    </TitledCard>
  );
}
