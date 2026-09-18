import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';

export interface FilterChipProps {
  children: React.ReactNode;
  checked: boolean;
  count?: number;
  onToggle: () => void;
}

const CHIP_BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  minHeight: '32px',
  paddingInline: '12px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '9999px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  whiteSpace: 'nowrap',
  transitionProperty: 'background-color, border-color, color, box-shadow',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:focus': { outline: 'none', boxShadow: 'none' },
  '&:focus-visible': {
    outline: '2px solid var(--color-progressive)',
    outlineOffset: '1px',
  },
} as const;

const CHIP_OFF = {
  ...CHIP_BASE,
  borderColor: 'var(--border-color-interactive)',
  backgroundColor: 'transparent',
  color: 'fg.muted',
  '&:hover': {
    backgroundColor: 'var(--background-color-interactive)',
    borderColor: 'var(--border-color-interactive--hover)',
    color: 'fg.emphasized',
  },
} as const;

const CHIP_ON = {
  ...CHIP_BASE,
  borderColor: 'var(--color-progressive)',
  backgroundColor: 'var(--background-color-interactive)',
  boxShadow: 'inset 0 0 0 1px var(--color-progressive)',
  color: 'fg.emphasized',
} as const;

const CHIP_DISABLED = {
  ...CHIP_OFF,
  cursor: 'not-allowed',
  opacity: 0.45,
  '&:hover': {
    backgroundColor: 'transparent',
    borderColor: 'var(--border-color-interactive)',
    color: 'fg.muted',
  },
} as const;

const CHIP_COUNT_CSS = {
  color: 'fg.muted',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 400,
  opacity: 0.7,
} as const;

export default function FilterChip({
  checked,
  children,
  count,
  onToggle,
}: FilterChipProps) {
  const disabled = count === 0 && !checked;

  return (
    <Box as="li" css={{ listStyle: 'none' }}>
      <chakra.button
        aria-pressed={checked}
        css={disabled ? CHIP_DISABLED : checked ? CHIP_ON : CHIP_OFF}
        disabled={disabled}
        type="button"
        onClick={onToggle}
      >
        {children}
        {count !== undefined && (
          <Box as="span" css={CHIP_COUNT_CSS}>
            {count}
          </Box>
        )}
      </chakra.button>
    </Box>
  );
}
