import { Box, Flex, Icon, Span, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import { IoMdGift } from 'react-icons/io';
import { MdOutlineAttachMoney, MdWorkspacePremium } from 'react-icons/md';

import VehicleImage from '@/components/features/vehicles/vehicleImage';
import { EmptyState } from '@/components/ui/empty-state';
import TitledCard from '@/components/wiki/titledCard';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

const premiumConfig: Record<
  NonNullable<ListVehicle['premium']>,
  { color: string; icon: React.ComponentType }
> = {
  coins: { color: 'yellow.400', icon: MdWorkspacePremium },
  money: { color: 'green.400', icon: MdOutlineAttachMoney },
  badge: { color: 'purple.400', icon: IoMdGift },
};

interface ListVehiclesProps {
  initials: string;
  vehicles: ListVehicle[];
}

export default function ListVehicles({
  initials,
  vehicles,
}: ListVehiclesProps) {
  if (vehicles.length === 0) {
    return (
      <TitledCard as="section" title="Lore vehicles" withAnchor>
        <EmptyState
          icon={<GrDocumentMissing />}
          title="No lore vehicles for this team"
        />
      </TitledCard>
    );
  }

  return (
    <TitledCard as="section" innerPadding={3} title="Lore vehicles" withAnchor>
      <Box
        data-md-ignore
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fill, minmax(140px, 1fr))"
      >
        {vehicles.map((vehicle) => {
          const config = vehicle.premium
            ? premiumConfig[vehicle.premium]
            : null;

          return (
            <NextLink
              key={vehicle.slug}
              href={`/${initials}/vehicles/${vehicle.slug}`}
              prefetch={false}
            >
              <Stack
                _hover={{ backgroundColor: 'bg.emphasized' }}
                backgroundColor="bg.muted"
                gap={0}
                overflow="hidden"
                transition="background-color 0.15s"
                width="100%"
              >
                <Box height="80px" position="relative" width="100%">
                  <VehicleImage
                    fill
                    name={vehicle.name}
                    sizes="200px"
                    slug={vehicle.slug}
                  />
                </Box>

                <Flex alignItems="center" padding={1.5} width="100%">
                  <Stack flex={1} gap={0} minWidth={0}>
                    <Span
                      fontSize="xs"
                      lineHeight="short"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {vehicle.name}
                    </Span>
                    <Span
                      color="fg.muted"
                      fontSize="2xs"
                      lineHeight="short"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {vehicle.role}
                    </Span>
                  </Stack>
                  {config && (
                    <Icon boxSize="14px" color={config.color} flexShrink={0}>
                      <config.icon />
                    </Icon>
                  )}
                </Flex>
              </Stack>
            </NextLink>
          );
        })}
      </Box>

      <div data-md-show style={{ display: 'none' }}>
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.slug}>
                <td>
                  <NextLink
                    href={`/${initials}/vehicles/${vehicle.slug}`}
                    prefetch={false}
                  >
                    {vehicle.name}
                  </NextLink>
                </td>
                <td>{vehicle.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TitledCard>
  );
}
