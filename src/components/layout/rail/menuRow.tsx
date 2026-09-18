import { Box, Flex, Icon } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { QUIET_ROW_CSS } from '@/components/ui/styles';

import type { MenuLink } from '@/components/layout/rail/useMenuLinks';

export default function MenuRow({ link }: { link: MenuLink }) {
  const IconComponent = link.icon;
  const row = (
    <Flex
      color={link.active ? 'fg.emphasized' : 'fg'}
      css={{
        ...QUIET_ROW_CSS,
        gap: '10px',
        paddingInline: '10px',
        backgroundColor: link.active ? 'quiet.active' : 'transparent',
        transitionProperty: 'background-color, color',
        transitionDuration: DURATION_BASE,
        transitionTimingFunction: EASE,
        '& .citizen-menu-icon': {
          color: link.active ? 'fg.emphasized' : 'fg.muted',
          transitionProperty: 'color',
          transitionDuration: DURATION_BASE,
          transitionTimingFunction: EASE,
        },
        '&:hover': {
          backgroundColor: link.active ? 'quiet.active' : 'quiet.hover',
          textDecoration: 'none',
        },
        '&:hover .citizen-menu-icon': {
          color: link.active ? 'fg.emphasized' : 'fg',
        },
      }}
    >
      <Icon as={IconComponent} boxSize="16px" className="citizen-menu-icon" />
      <span>{link.label}</span>
    </Flex>
  );

  return (
    <Box as="li" css={{ listStyle: 'none', margin: 0 }}>
      {link.external ? (
        <a href={link.href} rel="noopener noreferrer" target="_blank">
          {row}
        </a>
      ) : (
        <NextLink
          aria-current={link.active ? 'page' : undefined}
          href={link.href}
          prefetch={link.prefetch}
        >
          {row}
        </NextLink>
      )}
    </Box>
  );
}
