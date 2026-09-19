import { Box, Tabs } from '@chakra-ui/react';
import React from 'react';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const LIST_WRAP_CSS: SystemStyleObject = {
  borderBlockEndWidth: '1px',
  borderBlockEndStyle: 'solid',
  borderColor: 'var(--border-color-subtle)',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
};

const LIST_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'stretch',
  gap: '4px',
  border: 0,
  minWidth: 'fit-content',
};

const TRIGGER_CSS: SystemStyleObject = {
  position: 'relative',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  height: '40px',
  paddingInline: '12px',
  background: 'none',
  border: 0,
  borderRadius: '4px 4px 0 0',
  color: 'fg.muted',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  whiteSpace: 'nowrap',
  transitionProperty: 'color, background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:hover': { color: 'fg', background: 'quiet.hover' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
  '&[data-selected]': { color: 'fg.emphasized' },
  '&[data-selected]::after': {
    content: '""',
    position: 'absolute',
    insetInline: 0,
    insetBlockEnd: 0,
    height: '2px',
    background: 'var(--color-progressive)',
  },
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
};

export const TABS_ROOT_CSS: SystemStyleObject = {
  '& [role="tabpanel"]': { overflowAnchor: 'none' },
};

export function WikiTabsList({ children }: { children: React.ReactNode }) {
  return (
    <Box css={LIST_WRAP_CSS}>
      <Tabs.List css={LIST_CSS}>{children}</Tabs.List>
    </Box>
  );
}

export function WikiTabTrigger({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  return (
    <Tabs.Trigger css={TRIGGER_CSS} value={value}>
      {children}
    </Tabs.Trigger>
  );
}
