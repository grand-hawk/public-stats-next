import { HStack, Icon, Separator, Stack } from '@chakra-ui/react';
import React from 'react';
import { BsDatabaseFillCheck } from 'react-icons/bs';
import { MdCode } from 'react-icons/md';

import { useVehicle } from '@/hooks/providers/vehicle';

export default function VehicleDataInfo({ compact }: { compact?: boolean }) {
  const vehicle = useVehicle();

  const lastRetrievedDate = new Date(vehicle.info.lastRetrieved);

  return (
    <Stack
      backgroundColor={compact ? undefined : 'bg.subtle/75'}
      borderLeftWidth={
        compact
          ? undefined
          : {
              base: 0,
              md: '1px',
            }
      }
      borderRightWidth={
        compact
          ? undefined
          : {
              base: 0,
              md: '1px',
            }
      }
      borderYWidth={compact ? undefined : '1px'}
      padding={compact ? undefined : 2}
      fontSize="xs"
      borderColor="border/75"
      color="fg.muted"
      css={{
        '& span': {
          lineHeight: 'shorter',
        },
        '& .chakra-stack': {
          flex: compact ? 1 : undefined,
        },
      }}
      flexDirection={compact ? { base: 'column', sm: 'row' } : 'column'}
      justifyContent={compact ? 'center' : undefined}
      gap={compact ? { base: 1, sm: 4 } : 2}
    >
      <HStack
        justifyContent={
          compact ? { base: 'center', sm: 'flex-end' } : undefined
        }
      >
        <Icon as={BsDatabaseFillCheck} />
        <span>
          Last updated:{' '}
          <span
            title={lastRetrievedDate.toLocaleString()}
            suppressHydrationWarning
          >
            {lastRetrievedDate.toLocaleDateString()}
          </span>
        </span>
      </HStack>

      {compact && <Separator orientation="vertical" />}

      <HStack
        justifyContent={
          compact ? { base: 'center', sm: 'flex-start' } : undefined
        }
      >
        <Icon as={MdCode} />
        <span title="The internal ID of the vehicle, useful for the loadout editor">
          ID: &quot;{vehicle.info.gameId}&quot;
        </span>
      </HStack>
    </Stack>
  );
}
