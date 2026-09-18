import { Box, Icon, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuSearch } from 'react-icons/lu';

import { DURATION_MEDIUM, EASE } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

export const SEARCH_FIELD_HEIGHT = '40px';

export interface SearchFieldProps {
  onChange: (value: string) => void;
  onSelect?: () => void;
  placeholder?: string;
  value: string;
}

const WRAP_CSS = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
} as const;

const ICON_CSS = {
  position: 'absolute',
  insetInlineStart: '12px',
  width: '16px',
  height: '16px',
  color: 'fg.muted',
  pointerEvents: 'none',
} as const;

const INPUT_CSS = {
  width: '100%',
  height: SEARCH_FIELD_HEIGHT,
  paddingInlineStart: '36px',
  paddingInlineEnd: '12px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-interactive)',
  borderRadius: '4px',
  backgroundColor: 'var(--color-surface-1)',
  boxShadow: 'inset 0 0 0 1px transparent',
  color: 'fg',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  transitionProperty: 'background-color, color, border-color, box-shadow',
  transitionDuration: DURATION_MEDIUM,
  transitionTimingFunction: EASE,
  '&::placeholder': { color: 'var(--color-placeholder)' },
  '&::-webkit-search-cancel-button': { display: 'none' },
  '&:hover': { borderColor: 'var(--border-color-interactive--hover)' },
  '&:focus, &:focus-visible': {
    ...FOCUS_RING_CSS,
    borderColor: 'var(--border-color-progressive--focus)',
  },
} as const;

export default function SearchField({
  onChange,
  onSelect,
  placeholder = 'Search',
  value,
}: SearchFieldProps) {
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
        onSelect={onSelect}
      />
    </Box>
  );
}
