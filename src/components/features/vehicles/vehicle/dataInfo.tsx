import { HStack, Icon, Stack } from '@chakra-ui/react';
import React from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdCode } from 'react-icons/md';

import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import { useVehicle } from '@/hooks/providers/vehicle';

import type { StackProps } from '@chakra-ui/react';

export default function VehicleDataInfo({ ...props }: StackProps) {
  const vehicle = useVehicle();

  const addedDate = vehicle.info.addedDate && new Date(vehicle.info.addedDate);

  return (
    <Stack
      color="fg.muted"
      fontSize="xs"
      padding={3}
      css={{
        ...RAISED_FRAME_CSS,
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
