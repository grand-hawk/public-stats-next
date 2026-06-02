import { Box, Flex, Span, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import PremiumIcon from '@/components/features/vehicles/premiumIcon';
import VehicleImage from '@/components/features/vehicles/vehicleImage';

import type { TeamVehicle } from '@/server/api/trpc/routers/teams';

interface VehicleCellProps {
  initials: string;
  name: string;
  vehicle: TeamVehicle;
}

export default function VehicleCell({
  initials,
  name,
  vehicle,
}: VehicleCellProps) {
  return (
    <NextLink href={`/${initials}/vehicles/${vehicle.slug}`} prefetch={false}>
      <Stack
        _hover={{ backgroundColor: 'bg.emphasized' }}
        backgroundColor="bg.muted"
        gap={0}
        overflow="hidden"
        transition="background-color 0.15s"
        width="100%"
      >
        <Box height="80px" position="relative" width="100%">
          <VehicleImage height={80} name={name} slug={vehicle.slug} width={200} />
        </Box>

        <Flex alignItems="center" padding={1.5} width="100%">
          <Span
            flex={1}
            fontSize="xs"
            lineHeight="short"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {name}
          </Span>
          <PremiumIcon premium={vehicle.premiumType} />
        </Flex>
      </Stack>
    </NextLink>
  );
}
