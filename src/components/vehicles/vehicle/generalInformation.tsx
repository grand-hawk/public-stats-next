import { Box, FormatNumber } from '@chakra-ui/react';
import React from 'react';

import Stat from '@/components/stat';
import TitledCard from '@/components/vehicles/titledCard';
import { useVehicle } from '@/hooks/contexts/vehicle';
import { capitalizeFirst } from '@/utils/capitalizeFirst';

export default function VehicleGeneralInformation({
  isAvailable,
}: {
  isAvailable: boolean;
}) {
  const vehicle = useVehicle();

  return (
    <TitledCard as="section" title="General information" withAnchor>
      <Box
        display="grid"
        gapX={6}
        gapY={2}
        gridTemplateColumns="repeat(auto-fit, minmax(12rem, 1fr))"
      >
        <Stat label="Locomotion">
          {capitalizeFirst(vehicle.info.locomotion)}
        </Stat>

        {vehicle.info.amphibious && <Stat label="Amphibious">Yes</Stat>}

        {vehicle.info.supportedClasses.length > 0 && (
          <Stat label="Supported classes">
            {capitalizeFirst(
              vehicle.info.supportedClasses.join(', ').toLowerCase(),
            )}
          </Stat>
        )}

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
      </Box>
    </TitledCard>
  );
}
