import { Badge, Box, HStack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import PremiumIcon from '@/components/features/vehicles/premiumIcon';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import TeamIcon from '@/components/icons/teams';

import type { PremiumType } from '@/components/features/vehicles/premiumIcon';

const CARD_IMAGE_HEIGHT = 110;

interface VehicleCardProps {
  href: string;
  imageWidth: number;
  isNew?: boolean;
  name: string;
  premium?: PremiumType;
  role: string;
  slug: string;
  team: string;
}

export default React.memo(function VehicleCard({
  href,
  imageWidth,
  isNew,
  name,
  premium,
  role,
  slug,
  team,
}: VehicleCardProps) {
  return (
    <Box
      asChild
      display="block"
      overflow="hidden"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
      transition="border-color 0.2s"
      _hover={{
        borderColor: 'blue.500',
        textDecoration: 'none',
      }}
    >
      <NextLink href={href} prefetch={false}>
        <Box
          position="relative"
          height="110px"
          overflow="hidden"
          backgroundColor="blackAlpha.500"
        >
          <VehicleImage
            height={CARD_IMAGE_HEIGHT}
            name={name}
            slug={slug}
            type="perspective"
            width={imageWidth}
          />
          {isNew && (
            <Badge
              colorPalette="blue"
              position="absolute"
              size="sm"
              top={1.5}
              left={1.5}
            >
              NEW
            </Badge>
          )}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height="36px"
            pointerEvents="none"
            background="linear-gradient(to top, var(--chakra-colors-bg-subtle), transparent)"
          />
        </Box>

        <Box backgroundColor="bg.subtle" paddingX={2.5} paddingY={2}>
          <HStack gap={1} justifyContent="space-between" marginBottom={0.5}>
            <Text fontSize="xs" fontWeight="semibold" lineClamp={1} flex={1}>
              {name}
            </Text>
            <HStack flexShrink={0} gap={1}>
              <PremiumIcon premium={premium} />
              <TeamIcon team={team} />
            </HStack>
          </HStack>
          <Text
            color="fg.subtle"
            fontSize="xs"
            letterSpacing="0.05em"
            lineClamp={1}
            textTransform="uppercase"
          >
            {role}
          </Text>
        </Box>
      </NextLink>
    </Box>
  );
});
