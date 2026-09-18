import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuCheck } from 'react-icons/lu';

import { DURATION_MEDIUM } from '@/components/layout/shell/constants';
import {
  FOCUS_RING_CSS,
  QUIET_INTERACTIVE_CSS,
  TRUNCATE_CSS,
} from '@/components/ui/styles';

export interface FilterCheckboxProps {
  checked: boolean;
  count?: number;
  label: string;
  onToggle: () => void;
}

const ROW_CSS = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  minHeight: '32px',
  paddingInline: '8px',
  borderRadius: '4px',
  color: 'fg',
  cursor: 'pointer',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  textAlign: 'start',
  ...QUIET_INTERACTIVE_CSS,
  '&:focus': { outline: 'none', boxShadow: 'none' },
  '&:focus-visible': FOCUS_RING_CSS,
} as const;

const ROW_DISABLED_CSS = {
  ...ROW_CSS,
  cursor: 'not-allowed',
  opacity: 0.45,
  '&:hover': { backgroundColor: 'transparent' },
  '&:active': { backgroundColor: 'transparent' },
} as const;

const BOX_CSS = {
  flex: 'none',
  display: 'grid',
  placeItems: 'center',
  width: '20px',
  height: '20px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-interactive)',
  borderRadius: '4px',
  transitionProperty: 'background-color, border-color',
  transitionDuration: DURATION_MEDIUM,
  '& svg': { width: '14px', height: '14px' },
} as const;

const BOX_CHECKED_CSS = {
  ...BOX_CSS,
  backgroundColor: 'var(--background-color-progressive)',
  borderColor: 'var(--border-color-progressive)',
  color: 'var(--color-inverted-primary)',
} as const;

const LABEL_CSS = {
  ...TRUNCATE_CSS,
  minWidth: 0,
} as const;

const COUNT_CSS = {
  marginInlineStart: 'auto',
  color: 'fg.muted',
  fontVariantNumeric: 'tabular-nums',
  opacity: 0.7,
} as const;

export default function FilterCheckbox({
  checked,
  count,
  label,
  onToggle,
}: FilterCheckboxProps) {
  const disabled = count === 0 && !checked;

  return (
    <Box as="li" css={{ listStyle: 'none' }}>
      <chakra.button
        aria-checked={checked}
        css={disabled ? ROW_DISABLED_CSS : ROW_CSS}
        disabled={disabled}
        role="checkbox"
        type="button"
        onClick={onToggle}
      >
        <Box aria-hidden css={checked ? BOX_CHECKED_CSS : BOX_CSS}>
          {checked && <LuCheck />}
        </Box>
        <Box as="span" css={LABEL_CSS}>
          {label}
        </Box>
        {count !== undefined && (
          <Box as="span" css={COUNT_CSS}>
            {count}
          </Box>
        )}
      </chakra.button>
    </Box>
  );
}
