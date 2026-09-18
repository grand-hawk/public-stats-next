import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuCheck } from 'react-icons/lu';

import { DURATION_MEDIUM } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS, QUIET_INTERACTIVE_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const ROW_CSS: SystemStyleObject = {
  ...QUIET_INTERACTIVE_CSS,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '24px',
  paddingInline: '4px',
  marginInlineStart: '-4px',
  borderRadius: '4px',
  color: 'fg',
  cursor: 'pointer',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.45,
    backgroundColor: 'transparent',
  },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
};

const BOX_CSS: SystemStyleObject = {
  flex: 'none',
  display: 'grid',
  placeItems: 'center',
  width: '18px',
  height: '18px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-interactive)',
  borderRadius: '4px',
  transitionProperty: 'background-color, border-color',
  transitionDuration: DURATION_MEDIUM,
  '& svg': { width: '12px', height: '12px' },
};

const BOX_CHECKED_CSS: SystemStyleObject = {
  ...BOX_CSS,
  backgroundColor: 'var(--background-color-progressive)',
  borderColor: 'var(--border-color-progressive)',
  color: 'var(--color-inverted-primary)',
};

const COST_CSS: SystemStyleObject = {
  color: 'fg.muted',
  fontVariantNumeric: 'tabular-nums',
};

export default function AlterationCheckbox({
  checked,
  cost,
  disabled = false,
  label,
  onToggle,
}: {
  checked: boolean;
  cost: number;
  disabled?: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <chakra.button
      aria-checked={checked}
      aria-label={label}
      css={ROW_CSS}
      disabled={disabled}
      role="checkbox"
      type="button"
      onClick={onToggle}
    >
      <Box aria-hidden css={checked ? BOX_CHECKED_CSS : BOX_CSS}>
        {checked && <LuCheck />}
      </Box>
      <Box as="span" css={COST_CSS}>
        {cost} pts
      </Box>
    </chakra.button>
  );
}
