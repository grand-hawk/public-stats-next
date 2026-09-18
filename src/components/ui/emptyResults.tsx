import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import { QUIET_INTERACTIVE_CSS } from '@/components/ui/styles';

export interface EmptyResultsProps {
  hasFilters?: boolean;
  message: string;
  onClearAll?: () => void;
}

const BOX_CSS = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '24px',
  borderWidth: '1px',
  borderStyle: 'dashed',
  borderColor: 'var(--border-color-interactive)',
  borderRadius: '8px',
  textAlign: 'center',
} as const;

const BUTTON_CSS = {
  minHeight: '32px',
  paddingInline: '12px',
  borderRadius: '4px',
  color: 'var(--color-progressive)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  ...QUIET_INTERACTIVE_CSS,
} as const;

export default function EmptyResults({
  hasFilters = false,
  message,
  onClearAll,
}: EmptyResultsProps) {
  return (
    <Box css={BOX_CSS}>
      <Text
        color="fg.muted"
        css={{ fontSize: '0.875rem', lineHeight: '1.375rem' }}
      >
        {message}
      </Text>
      {hasFilters && onClearAll && (
        <chakra.button css={BUTTON_CSS} type="button" onClick={onClearAll}>
          Clear all filters
        </chakra.button>
      )}
    </Box>
  );
}
