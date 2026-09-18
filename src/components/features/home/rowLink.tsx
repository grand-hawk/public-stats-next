import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import {
  FOCUS_RING_CSS,
  QUIET_HOVER_CSS,
  QUIET_INTERACTIVE_CSS,
} from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const ROW_LINK_CSS: SystemStyleObject = {
  ...QUIET_INTERACTIVE_CSS,
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  gap: '8px',
  minWidth: 0,
  marginInline: '-8px',
  paddingInline: '8px',
  borderRadius: '4px',
  textDecoration: 'none',
  transitionProperty: 'background-color, color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
};

export default function HomeRowLink({
  children,
  css,
  hoverCss,
  href,
}: {
  children: React.ReactNode;
  css?: SystemStyleObject;
  hoverCss?: SystemStyleObject;
  href: string;
}) {
  return (
    <Box
      asChild
      css={{
        ...ROW_LINK_CSS,
        ...css,
        '&:hover': { ...QUIET_HOVER_CSS, ...hoverCss },
      }}
    >
      <NextLink href={href} prefetch={false}>
        {children}
      </NextLink>
    </Box>
  );
}
