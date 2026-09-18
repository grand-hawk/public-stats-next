import { Box, Text, chakra } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import SearchField from '@/components/ui/searchField';
import { FOCUS_RING_CSS, QUIET_INTERACTIVE_CSS } from '@/components/ui/styles';
import { simplifyString } from '@/utils/simplifyString';

import type { SystemStyleObject } from '@chakra-ui/react';

const LIST_CSS: SystemStyleObject = {
  position: 'relative',
  maxHeight: '280px',
  overflowY: 'auto',
  padding: '0 8px 8px',
};

const ITEM_CSS: SystemStyleObject = {
  ...QUIET_INTERACTIVE_CSS,
  position: 'absolute',
  insetInline: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  paddingInline: '8px',
  borderRadius: '4px',
  color: 'fg',
  cursor: 'pointer',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  textAlign: 'start',
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
};

interface PickerListProps<T extends { slug: string }> {
  emptyMessage: string;
  itemHeight: number;
  items: T[];
  matchesQuery: (item: T, simplifiedQuery: string) => boolean;
  placeholder: string;
  renderItem: (item: T) => React.ReactNode;
  selectedSlugs: string[];
  onSelect: (slug: string) => void;
}

export default function PickerList<T extends { slug: string }>({
  emptyMessage,
  itemHeight,
  items,
  matchesQuery,
  onSelect,
  placeholder,
  renderItem,
  selectedSlugs,
}: PickerListProps<T>) {
  const [query, setQuery] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  const available = items.filter((item) => !selectedSlugs.includes(item.slug));
  const filtered = query
    ? available.filter((item) => matchesQuery(item, simplifyString(query)))
    : available;

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => itemHeight,
    overscan: 8,
  });

  return (
    <>
      <Box padding="8px">
        <SearchField
          placeholder={placeholder}
          value={query}
          onChange={setQuery}
        />
      </Box>

      <Box ref={listRef} css={LIST_CSS}>
        {filtered.length === 0 ? (
          <Text
            color="fg.muted"
            css={{ fontSize: '0.875rem', paddingBlock: '8px' }}
          >
            {emptyMessage}
          </Text>
        ) : (
          <Box
            css={{ position: 'relative' }}
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const item = filtered[virtualItem.index];
              return (
                <chakra.button
                  key={item.slug}
                  css={ITEM_CSS}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  type="button"
                  onClick={() => onSelect(item.slug)}
                >
                  {renderItem(item)}
                </chakra.button>
              );
            })}
          </Box>
        )}
      </Box>
    </>
  );
}
