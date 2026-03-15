import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import { LuPlus } from 'react-icons/lu';

import { HEADER_ROW_HEIGHT } from '@/components/features/compare';
import { simplifyString } from '@/utils/simplifyString';

export interface AddColumnHeaderProps<T extends { slug: string }> {
  items: T[];
  selectedSlugs: string[];
  onAdd: (slug: string) => void;
  matchesQuery: (item: T, simplifiedQuery: string) => boolean;
  renderItem: (item: T) => React.ReactNode;
  itemHeight: number;
  placeholder?: string;
  addLabel?: string;
  emptyMessage?: string;
}

export default function AddColumnHeader<T extends { slug: string }>({
  addLabel = 'Add',
  emptyMessage = 'No items found',
  itemHeight,
  items,
  matchesQuery,
  onAdd,
  placeholder = 'Search...',
  renderItem,
  selectedSlugs,
}: AddColumnHeaderProps<T>) {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const available = React.useMemo(
    () => items.filter((i) => !selectedSlugs.includes(i.slug)),
    [items, selectedSlugs],
  );

  const filtered = React.useMemo(() => {
    if (!query) return available;
    const simplified = simplifyString(query);
    return available.filter((i) => matchesQuery(i, simplified));
  }, [available, query, matchesQuery]);

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => itemHeight,
    overscan: 8,
  });

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = React.useCallback(
    (slug: string) => {
      onAdd(slug);
      setQuery('');
      setIsOpen(false);
    },
    [onAdd],
  );

  return (
    <Box ref={containerRef} position="relative">
      <Flex
        alignItems="center"
        cursor="pointer"
        flexShrink={0}
        gap={1.5}
        height={HEADER_ROW_HEIGHT}
        justifyContent="center"
        overflow="hidden"
        paddingX={3}
        paddingY={2.5}
        transition="all 0.15s"
        _hover={{ color: 'fg' }}
        color="fg.muted"
        onClick={() => {
          setIsOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
      >
        {isOpen ? (
          <Input
            ref={inputRef}
            background="transparent"
            borderColor="border.muted"
            borderRadius="0"
            borderWidth="1px"
            fontSize="sm"
            size="sm"
            paddingX={2}
            placeholder={placeholder}
            value={query}
            width="100%"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setQuery(e.target.value)}
          />
        ) : (
          <>
            <LuPlus size={14} />
            <Text fontSize="xs" whiteSpace="nowrap">
              {addLabel}
            </Text>
          </>
        )}
      </Flex>

      {isOpen && (
        <Box
          ref={listRef}
          background="bg.panel"
          borderColor="border.muted"
          borderWidth="1px"
          boxShadow="lg"
          left={0}
          maxHeight={280}
          minWidth="200px"
          overflowY="auto"
          position="absolute"
          right={0}
          top="100%"
          zIndex={50}
        >
          {filtered.length === 0 ? (
            <Text color="fg.muted" fontSize="sm" padding={3}>
              {emptyMessage}
            </Text>
          ) : (
            <Box
              position="relative"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const item = filtered[virtualItem.index];
                return (
                  <Flex
                    key={item.slug}
                    _hover={{ background: 'whiteAlpha.100' }}
                    alignItems="center"
                    cursor="pointer"
                    gap={2}
                    left={0}
                    overflow="hidden"
                    paddingX={3}
                    paddingY={1.5}
                    position="absolute"
                    right={0}
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    top={0}
                    whiteSpace="nowrap"
                    onClick={() => handleSelect(item.slug)}
                  >
                    {renderItem(item)}
                  </Flex>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
