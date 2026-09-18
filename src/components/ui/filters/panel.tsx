import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import { CLEAR_BUTTON_CSS } from '@/components/ui/filters/styles';
import SearchField from '@/components/ui/searchField';
import { TRUNCATE_CSS } from '@/components/ui/styles';

export interface FilterPanelProps {
  children: React.ReactNode;
  hasFilters: boolean;
  onClearAll: () => void;
  onQueryChange: (value: string) => void;
  pending?: boolean;
  query: string;
  resultLabel: string;
  searchPlaceholder?: string;
}

const PANEL_CSS = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
} as const;

const STATUS_CSS = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '32px',
  paddingInline: '8px',
  color: 'fg.muted',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  fontVariantNumeric: 'tabular-nums',
} as const;

const CLEAR_CSS = {
  ...CLEAR_BUTTON_CSS,
  flexShrink: 0,
  minHeight: '32px',
  whiteSpace: 'nowrap',
} as const;

export default function FilterPanel({
  children,
  hasFilters,
  onClearAll,
  onQueryChange,
  pending = false,
  query,
  resultLabel,
  searchPlaceholder,
}: FilterPanelProps) {
  return (
    <Box css={PANEL_CSS}>
      <Box padding="8px">
        <SearchField
          placeholder={searchPlaceholder}
          value={query}
          onChange={onQueryChange}
        />
      </Box>

      <Box css={STATUS_CSS}>
        <Text
          as="span"
          css={{
            ...TRUNCATE_CSS,
            minWidth: 0,
            opacity: pending ? 0.5 : 1,
            transitionProperty: 'opacity',
            transitionDuration: '250ms',
          }}
        >
          {resultLabel}
        </Text>
        {hasFilters && (
          <chakra.button css={CLEAR_CSS} type="button" onClick={onClearAll}>
            Clear all
          </chakra.button>
        )}
      </Box>

      {children}
    </Box>
  );
}
