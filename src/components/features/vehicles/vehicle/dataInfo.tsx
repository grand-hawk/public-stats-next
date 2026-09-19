import { Box, HStack, Icon, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdAccountTree, MdCode, MdSubdirectoryArrowRight } from 'react-icons/md';

import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import { useVehicle } from '@/hooks/providers/vehicle';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { StackProps, SystemStyleObject } from '@chakra-ui/react';

const LINK_CSS: SystemStyleObject = {
  color: 'var(--color-progressive)',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
};

export default function VehicleDataInfo({ ...props }: StackProps) {
  const vehicle = useVehicle();
  const initials = usePlaceInitials()!;
  const { family, variantOf } = vehicle.info.lineage;

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
      {family && (
        <HStack>
          <Icon as={MdAccountTree} />
          <span>
            Family:{' '}
            <Box asChild css={LINK_CSS}>
              <NextLink
                href={`/${initials}/vehicles/families/${family.slug}`}
                prefetch={false}
              >
                {family.name}
              </NextLink>
            </Box>
          </span>
        </HStack>
      )}

      {variantOf && (
        <HStack>
          <Icon as={MdSubdirectoryArrowRight} />
          <span>
            Based on:{' '}
            <Box asChild css={LINK_CSS}>
              <NextLink
                href={`/${initials}/vehicles/${variantOf.slug}`}
                prefetch={false}
              >
                {variantOf.name}
              </NextLink>
            </Box>
          </span>
        </HStack>
      )}

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
