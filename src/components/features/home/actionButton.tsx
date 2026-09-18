import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const BUTTON_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  height: '36px',
  paddingInline: '12px',
  borderWidth: 0,
  borderRadius: '4px',
  backgroundColor: 'var(--color-surface-2)',
  color: 'var(--color-emphasized)',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '22px',
  textDecoration: 'none',
  transitionProperty: 'background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '& svg': {
    width: '16px',
    height: '16px',
    flex: 'none',
    transitionProperty: 'transform',
    transitionDuration: DURATION_BASE,
    transitionTimingFunction: EASE,
  },
  '&:hover': {
    backgroundColor: 'var(--color-surface-3)',
    textDecoration: 'none',
  },
  '&:hover svg': { transform: 'translateX(2px)' },
  '&:active': { backgroundColor: 'var(--color-surface-4)' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
  '@media (prefers-reduced-motion: reduce)': {
    '& svg': { transition: 'none' },
  },
};

export default function ActionButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Box asChild css={BUTTON_CSS}>
      <NextLink href={href} prefetch={false}>
        <span>{children}</span>
        <LuArrowRight aria-hidden />
      </NextLink>
    </Box>
  );
}
