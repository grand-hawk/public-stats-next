import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

export type PillSize = 'xs' | 'sm' | 'md' | 'lg';

const GROUP_CSS: SystemStyleObject = {
  gap: '2px',
  padding: '2px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-base)',
  borderRadius: '4px',
  backgroundColor: 'var(--color-surface-1)',
};

const SIZE_CSS: Record<PillSize, SystemStyleObject> = {
  xs: {
    height: '24px',
    paddingInline: '10px',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
  },
  sm: {
    height: '28px',
    paddingInline: '10px',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
  },
  md: {
    height: '28px',
    paddingInline: '10px',
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
  },
  lg: {
    height: '32px',
    minWidth: 0,
    paddingInline: '4px',
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
  },
};

const PILL_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  transitionProperty: 'background-color, color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:focus-visible': FOCUS_RING_CSS,
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
};

export interface PillGroupProps {
  children: React.ReactNode;
  columns?: number;
  label: string;
}

export function PillGroup({ children, columns, label }: PillGroupProps) {
  return (
    <Box
      aria-label={label}
      role="group"
      css={{
        ...GROUP_CSS,
        ...(columns
          ? { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` }
          : { display: 'inline-flex', flexShrink: 0 }),
      }}
    >
      {children}
    </Box>
  );
}

export interface PillProps {
  children: React.ReactNode;
  css?: SystemStyleObject;
  onClick: () => void;
  selected: boolean;
  size?: PillSize;
}

export function Pill({
  children,
  css,
  onClick,
  selected,
  size = 'md',
}: PillProps) {
  return (
    <chakra.button
      aria-pressed={selected}
      type="button"
      css={{
        ...PILL_CSS,
        ...SIZE_CSS[size],
        color: selected ? 'fg.emphasized' : 'fg.muted',
        backgroundColor: selected ? 'quiet.active' : 'transparent',
        '&:hover': {
          color: selected ? 'fg.emphasized' : 'fg',
          backgroundColor: selected ? 'quiet.active' : 'quiet.hover',
        },
        ...css,
      }}
      onClick={onClick}
    >
      {children}
    </chakra.button>
  );
}
