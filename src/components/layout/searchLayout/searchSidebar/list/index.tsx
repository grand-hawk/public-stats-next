import { Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import slug from 'slug';

import {
  SearchListDividerItem,
  SearchLinkListItem,
} from '@/components/layout/searchLayout/searchSidebar/list/item';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';

const ITEM_HEIGHT = 35;

export type DividerListItem = {
  type: 'divider';
  label: string;
  isTeam?: boolean;
  emphasized?: boolean;
};

export type LinkListItem = {
  type: 'item';
  value: {
    name: React.ReactNode;
    slug: string;
  };
};

export type ListItem = DividerListItem | LinkListItem;

export interface SearchListProps {
  listItems: ListItem[];
  queryKey: string;
  queryKeyPlural: string;
}

export default function SearchList({
  listItems,
  queryKey,
  queryKeyPlural,
}: SearchListProps) {
  const place = usePlace()!;
  const queryValue = useRouterQuery(queryKey);
  const querySlug = queryValue ? slug(queryValue) : null;

  const initialOffset = React.useMemo(() => {
    if (!querySlug) return 0;

    const index = listItems.findIndex(
      (item) => item.type === 'item' && item.value.slug === querySlug,
    );
    if (index !== -1) return index * ITEM_HEIGHT;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: listItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
    initialRect: {
      height: 25 * ITEM_HEIGHT,
      width: 0,
    },
    initialOffset,
  });

  return (
    <Box ref={parentRef} height="100%" overflow="auto" scrollBehavior="unset">
      <Box
        position="relative"
        scrollBehavior="revert"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const listItem = listItems[virtualItem.index];

          const baseProps = {
            style: {
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            },
          } as const;

          if (listItem.type === 'divider')
            return (
              <SearchListDividerItem
                key={virtualItem.index}
                emphasized={listItem.emphasized}
                isTeam={listItem.isTeam}
                label={listItem.label}
                {...baseProps}
              />
            );
          return (
            <SearchLinkListItem
              key={virtualItem.index}
              active={querySlug === listItem.value.slug}
              href={`/${place.initials}/${queryKeyPlural}/${listItem.value.slug}`}
              {...baseProps}
            >
              {listItem.value.name}
            </SearchLinkListItem>
          );
        })}
      </Box>
    </Box>
  );
}
