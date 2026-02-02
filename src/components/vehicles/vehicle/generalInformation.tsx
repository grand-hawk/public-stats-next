import { Box, FormatNumber, HStack, Quote, Stack } from '@chakra-ui/react';
import React from 'react';

import CrewmanIcon from '@/components/icons/classes/crewman';
import EngineerIcon from '@/components/icons/classes/engineer';
import InfantryIcon from '@/components/icons/classes/infantry';
import { Tooltip } from '@/components/ui/tooltip';
import SectionMarker from '@/components/wiki/sectionMarker';
import Stat from '@/components/wiki/stat';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';
import { capitalizeFirst } from '@/utils/capitalizeFirst';

import type { IconProps } from '@chakra-ui/react';

const classIcons: Record<string, (props: IconProps) => React.ReactNode> = {
  Engineer: EngineerIcon,
  Infantry: InfantryIcon,
  Crewman: CrewmanIcon,
};

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
          <Stat label="In-game description">
            <Quote
              aria-label="Description"
              fontSize="sm"
              fontWeight="light"
              id="vehicle-page-description"
              whiteSpace="pre-wrap"
            >
              {vehicle.info.description}
            </Quote>
          </Stat>

          <Box display="flex" flexWrap="wrap" gap={6}>
            <Stat label="Locomotion">
              {capitalizeFirst(vehicle.info.locomotion)}
            </Stat>

            {vehicle.info.amphibious && <Stat label="Amphibious">Yes</Stat>}

            {vehicle.info.supportedClasses.length > 0 && (
              <Stat label="Supported classes" valueProps={{ height: '100%' }}>
                <HStack gap={1}>
                  {vehicle.info.supportedClasses.map((className) => {
                    const Icon = classIcons[className];
                    if (Icon)
                      return (
                        <Tooltip
                          content={className}
                          key={className}
                          lazyMount
                          openDelay={50}
                          closeDelay={50}
                        >
                          <Icon boxSize="1em" />
                        </Tooltip>
                      );
                  })}
                </HStack>
              </Stat>
            )}

            <Stat label="Obtainment">
              {isAvailable
                ? !vehicle.info.premium
                  ? 'Free'
                  : vehicle.info.premium.type === 'coins'
                    ? 'Premium'
                    : vehicle.info.premium.type === 'money'
                      ? 'Shop'
                      : 'Badge'
                : 'Dev-spawner only'}
            </Stat>

            {vehicle.info.premium?.cost !== undefined && (
              <Stat label="Price">
                <FormatNumber value={vehicle.info.premium.cost} />{' '}
                {vehicle.info.premium.type === 'coins' ? 'coins' : 'money'}
              </Stat>
            )}
          </Box>
        </Stack>
      </TitledCard>
    </>
  );
}
