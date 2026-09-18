import { HStack, Span } from '@chakra-ui/react';
import React from 'react';

import CrewmanIcon from '@/components/icons/classes/crewman';
import EngineerIcon from '@/components/icons/classes/engineer';
import InfantryIcon from '@/components/icons/classes/infantry';
import { ToggleTip } from '@/components/ui/toggle-tip';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { useVehicle } from '@/hooks/providers/vehicle';
import { getAllModulesOfType } from '@/utils/alterations';

import type { IconProps } from '@chakra-ui/react';

const classIcons: Record<string, (props: IconProps) => React.ReactNode> = {
  Engineer: EngineerIcon,
  Infantry: InfantryIcon,
  Crewman: CrewmanIcon,
};

export default function SupportedClasses() {
  const vehicle = useVehicle();
  const { assembledModules } = useDynamicData();

  const hasPassengerSeats = React.useMemo(() => {
    const seats = getAllModulesOfType('Seat', assembledModules);
    return seats.some((s) => s.data.name === 'Passenger');
  }, [assembledModules]);

  const showExtraInfantryIcon =
    hasPassengerSeats && !vehicle.info.supportedClasses.includes('Infantry');

  return (
    <HStack gap={1}>
      {vehicle.info.supportedClasses.map((className) => {
        const Icon = classIcons[className];
        if (Icon) {
          return (
            <ToggleTip
              closeDelay={50}
              content={className}
              key={className}
              openDelay={50}
            >
              <Icon boxSize="1.25em" />
            </ToggleTip>
          );
        }
      })}
      {showExtraInfantryIcon && (
        <>
          <Span
            color="fg.muted"
            fontSize="sm"
            lineHeight="1"
            marginRight={-0.75}
          >
            +
          </Span>
          <ToggleTip
            closeDelay={50}
            content="Infantry (as passenger)"
            openDelay={50}
          >
            <InfantryIcon boxSize="1.25em" />
          </ToggleTip>
        </>
      )}
    </HStack>
  );
}
