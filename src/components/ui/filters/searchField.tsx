import { Box, Icon, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuSearch } from 'react-icons/lu';

import { DURATION_MEDIUM } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

export interface FilterSearchFieldProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

const WRAP_CSS = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
} as const;

const ICON_CSS = {
  position: 'absolute',
  insetInlineStart: '8px',
  width: '16px',
  height: '16px',
  color: 'var(--color-placeholder)',
  pointerEvents: 'none',
} as const;

const INPUT_CSS = {
  width: '100%',
  minHeight: '32px',
  paddingBlock: '4px',
  paddingInlineStart: '32px',
  paddingInlineEnd: '8px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-interactive)',
  borderRadius: '4px',
  backgroundColor: 'transparent',
  boxShadow: 'inset 0 0 0 1px transparent',
  color: 'fg',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  transitionProperty: 'background-color, color, border-color, box-shadow',
  transitionDuration: DURATION_MEDIUM,
  '&::placeholder': { color: 'var(--color-placeholder)' },
  '&::-webkit-search-cancel-button': { display: 'none' },
  '&:focus': {
    ...FOCUS_RING_CSS,
    borderColor: 'var(--border-color-progressive--focus)',
  },
} as const;

export default function FilterSearchField({
  onChange,
  placeholder = 'Search',
  value,
}: FilterSearchFieldProps) {
  return (
    <Box css={WRAP_CSS}>
      <Icon as={LuSearch} css={ICON_CSS} />
      <chakra.input
        aria-label={placeholder}
        autoComplete="off"
        css={INPUT_CSS}
        placeholder={placeholder}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Box>
  );
}
