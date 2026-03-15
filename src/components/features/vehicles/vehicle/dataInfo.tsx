import { HStack, Icon, Stack } from '@chakra-ui/react';
import React from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdCode } from 'react-icons/md';

import { useVehicle } from '@/hooks/providers/vehicle';

import type { StackProps } from '@chakra-ui/react';

export default function VehicleDataInfo({ ...props }: StackProps) {
  const vehicle = useVehicle();

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
      {...props}
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
        <Icon as={MdCode} />
        <span>ID: &quot;{vehicle.info.gameId}&quot;</span>
      </HStack>
    </Stack>
  );
}
