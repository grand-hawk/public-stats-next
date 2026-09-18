import { FormatNumber, HStack, Stack } from '@chakra-ui/react';
import React from 'react';

import VehicleDescription from '@/components/features/vehicles/vehicle/generalInformation/description';
import SupportedClasses from '@/components/features/vehicles/vehicle/generalInformation/supportedClasses';
import { InfoTip } from '@/components/ui/toggle-tip';
import SectionMarker from '@/components/wiki/sectionMarker';
import Stat, { StatGrid } from '@/components/wiki/stat';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';
import { capitalizeFirst } from '@/utils/capitalizeFirst';
import { obtainmentLabel } from '@/utils/obtainment';

export default function VehicleGeneralInformation({
  isAvailable,
}: {
  isAvailable: boolean;
}) {
  const vehicle = useVehicle();

  return (
    <>
      <SectionMarker name="General information" />

      <TitledCard as="section" title="General information" withAnchor>
        <Stack gap={4}>
          <VehicleDescription />

          <StatGrid>
            <Stat label="Locomotion">
              {capitalizeFirst(vehicle.info.locomotion)}
            </Stat>

            {vehicle.info.amphibious && <Stat label="Amphibious">Yes</Stat>}

            {vehicle.info.hullBreak && (
              <Stat
                label={
                  <HStack gap={1}>
                    Hull break
                    <InfoTip>Explodes when its engine is destroyed</InfoTip>
                  </HStack>
                }
              >
                Yes
              </Stat>
            )}

            {vehicle.info.supportedClasses.length > 0 && (
              <Stat label="Supported classes">
                <SupportedClasses />
              </Stat>
            )}

            <Stat label="Obtainment">
              {isAvailable
                ? obtainmentLabel(vehicle.info.premium?.type)
                : 'Dev-spawner only'}
            </Stat>

            {vehicle.info.premium?.cost !== undefined && (
              <Stat label="Price">
                <FormatNumber value={vehicle.info.premium.cost} />{' '}
                {vehicle.info.premium.type === 'coins' ? 'coins' : 'money'}
              </Stat>
            )}
          </StatGrid>
        </Stack>
      </TitledCard>
    </>
  );
}
