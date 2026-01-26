import { Box, Center, Flex, Icon, Span, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import { IoMdGift } from 'react-icons/io';
import { MdOutlineAttachMoney, MdWorkspacePremium } from 'react-icons/md';

import VehicleImage from '@/components/vehicles/vehicleImage';

import type { TeamVehicle } from '@/server/api/trpc/routers/teams';

interface VehicleCellProps {
  initials: string;
  name: string;
  vehicle: TeamVehicle;
}

const premiumConfig = {
  true: { color: 'yellow.400', icon: MdWorkspacePremium },
  shop: { color: 'green.400', icon: MdOutlineAttachMoney },
  badge: { color: 'purple.400', icon: IoMdGift },
};

export default function VehicleCell({
  initials,
  name,
  vehicle,
}: VehicleCellProps) {
  const config =
    vehicle.premium !== false
      ? premiumConfig[vehicle.premium === true ? 'true' : vehicle.premium]
      : null;

  return (
    <NextLink href={`/${initials}/vehicles/${vehicle.slug}`}>
      <Stack
        _hover={{ backgroundColor: 'bg.emphasized' }}
        backgroundColor="bg.muted"
        gap={0}
        overflow="hidden"
        transition="background-color 0.15s"
        width="100%"
      >
        <Box height="80px" position="relative" width="100%">
          {vehicle.image ? (
            <VehicleImage
              fallbackText=""
              fill
              image={vehicle.image}
              name={name}
              sizes="200px"
              slug={vehicle.slug}
            />
          ) : (
            <Center height="100%" width="100%">
              <Icon color="fg.muted" size="lg">
                <GrDocumentMissing />
              </Icon>
            </Center>
          )}
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
          {config && (
            <Icon boxSize="14px" color={config.color} flexShrink={0}>
              <config.icon />
            </Icon>
          )}
        </Flex>
      </Stack>
    </NextLink>
  );
}
