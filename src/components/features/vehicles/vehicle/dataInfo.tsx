import { HStack, Icon, Stack } from '@chakra-ui/react';
import React from 'react';
import { BsDatabaseFillCheck } from 'react-icons/bs';
import { IoMdAdd } from 'react-icons/io';
import { MdCode } from 'react-icons/md';

import { useVehicle } from '@/hooks/providers/vehicle';

export default function VehicleDataInfo() {
  const vehicle = useVehicle();

  const lastRetrievedDate = new Date(vehicle.info.lastRetrieved);
  const addedDate = vehicle.info.addedDate && new Date(vehicle.info.addedDate);

  return (
    <Stack
      backgroundColor="bg.subtle/75"
      borderLeftWidth={{
        base: 0,
        md: '1px',
      }}
      borderRightWidth={{
        base: 0,
        md: '1px',
      }}
      borderYWidth="1px"
      padding={2}
      fontSize="xs"
      borderColor="border/75"
      color="fg.muted"
      css={{
        '& span': {
          lineHeight: 'shorter',
        },
      }}
      gap={2}
    >
      {addedDate && (
        <HStack>
          <Icon as={IoMdAdd} />
          <span>
            Added on:{' '}
            <span title={addedDate.toLocaleString()} suppressHydrationWarning>
              {addedDate.toLocaleDateString()}
            </span>
          </span>
        </HStack>
      )}

      <HStack>
        <Icon as={BsDatabaseFillCheck} />
        <span>
          Data as of:{' '}
          <span
            title={lastRetrievedDate.toLocaleString()}
            suppressHydrationWarning
          >
            {lastRetrievedDate.toLocaleDateString()}
          </span>
        </span>
      </HStack>

      <HStack>
        <Icon as={MdCode} />
        <span title="The internal ID of the vehicle, useful for the loadout editor">
          ID: &quot;{vehicle.info.gameId}&quot;
        </span>
      </HStack>
    </Stack>
  );
}
