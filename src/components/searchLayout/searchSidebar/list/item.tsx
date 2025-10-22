import { Flex, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import TeamIcon from '@/components/icons/teams';
import { Button } from '@/components/ui/button';

import type { ButtonProps } from '@/components/ui/button';
import type { FlexProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

const baseItemProps = {
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
} as const;

export const SearchListDividerItem = React.memo(function SearchListDividerItem({
  emphasized,
  isTeam,
  label,
  ...props
}: FlexProps & {
  label: string;
  isTeam?: boolean;
  emphasized?: boolean;
}) {
  return (
    <Flex
      alignItems="center"
      backgroundColor={isTeam || emphasized ? 'bg.emphasized' : 'bg.muted'}
      flexDirection="row"
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
});

export const SearchLinkListItem = React.memo(function SearchLinkListItem({
  active,
  children,
  href,
  ...props
}: PropsWithChildren<
  ButtonProps & {
    active?: boolean;
    href: string;
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
        <NextLink href={href}>{children}</NextLink>
      )}
    </Button>
  );
});
