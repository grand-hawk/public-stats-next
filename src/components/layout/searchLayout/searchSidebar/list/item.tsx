import { Box, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import TeamIcon from '@/components/icons/teams';
import { QUIET_ROW_CSS } from '@/components/ui/styles';

import type { BoxProps, FlexProps } from '@chakra-ui/react';
import type { LinkProps as NextLinkProps } from 'next/link';

const baseItemProps = {
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
} as const;

export const SearchListDividerItem = React.memo(function SearchListDividerItem({
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
      color="fg.muted"
      flexDirection="row"
      {...baseItemProps}
      {...props}
      css={{
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: '1.25rem',
        gap: '8px',
        paddingBlock: '12px 4px',
        paddingInline: '12px',
        textTransform: 'none',
        letterSpacing: 'normal',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {isTeam && <TeamIcon size="16px" team={label} />}
      {label}
    </Flex>
  );
});

export interface SearchLinkListItemProps extends BoxProps {
  active?: boolean;
  children: React.ReactNode;
  href: NextLinkProps['href'];
}

export const SearchLinkListItem = React.memo(function SearchLinkListItem({
  active,
  children,
  href,
  ...props
}: SearchLinkListItemProps) {
  const rowCss = {
    ...QUIET_ROW_CSS,
    gap: '8px',
    paddingInline: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: active ? 'fg.emphasized' : 'fg',
    backgroundColor: active ? 'quiet.active' : 'transparent',
    transition:
      'background-color 100ms var(--transition-timing-function-ease, ease)',
    '&:hover': {
      backgroundColor: active ? 'quiet.active' : 'quiet.hover',
      textDecoration: 'none',
    },
    '&:active': { backgroundColor: 'quiet.active' },
    '&:focus-visible': {
      outline: '1px solid var(--outline-color-progressive--focus)',
      outlineOffset: '-1px',
    },
  } as const;

  if (active) {
    return (
      <Box aria-current="page" {...baseItemProps} {...props} css={rowCss}>
        {children}
      </Box>
    );
  }

  return (
    <Box asChild {...baseItemProps} {...props} css={rowCss}>
      <NextLink href={href} prefetch={false} shallow>
        {children}
      </NextLink>
    </Box>
  );
});
