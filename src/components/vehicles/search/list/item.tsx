import { Flex, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import TeamIcon from '@/components/icons/teams';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import type { ButtonProps } from '@/components/ui/button';
import type { FlexProps, SkeletonProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

const baseItemProps = {
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
} as const;

export const VehicleSearchListDividerItem = React.memo(
  function VehicleSearchListDividerItem({
    isTeam,
    label,
    ...props
  }: FlexProps & {
    label: string;
    isTeam?: boolean;
  }) {
    return (
      <Flex
        alignItems="center"
        backgroundColor={isTeam ? 'bg.emphasized' : 'bg.muted'}
        direction="row"
        fontSize="sm"
        gap={2}
        lineHeight="short"
        paddingLeft={2}
        {...baseItemProps}
        {...props}
      >
        {isTeam && <TeamIcon team={label} />}
        {label}
      </Flex>
    );
  },
);

export const VehicleSearchListVehicleItem = React.memo(
  function VehicleSearchListVehicleItem({
    active,
    children,
    placeInitials: initials,
    slug,
    ...props
  }: PropsWithChildren<
    ButtonProps & {
      active?: boolean;
      slug: string;
      placeInitials: string;
    }
  >) {
    return (
      <Button
        _hover={{
          backgroundColor: active ? 'colorPalette.100' : undefined,
        }}
        asChild
        backgroundColor={active ? 'colorPalette.100' : undefined}
        borderRadius="none"
        justifyContent="flex-start"
        variant={active ? 'solid' : 'ghost'}
        {...baseItemProps}
        {...props}
      >
        {active ? (
          <Span>{children}</Span>
        ) : (
          <NextLink href={`/${initials}/vehicles/${slug}`}>{children}</NextLink>
        )}
      </Button>
    );
  },
);

export function VehicleSearchListItemSkeleton({ ...props }: SkeletonProps) {
  return <Skeleton {...props} borderRadius="none" width="100%" />;
}
