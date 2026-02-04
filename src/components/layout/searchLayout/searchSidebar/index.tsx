import { Box } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import { CenterSpinner } from '@/components/common/spinners';
import { SEARCH_INPUT_HEIGHT } from '@/components/layout/searchLayout/searchSidebar/input';
import SearchList from '@/components/layout/searchLayout/searchSidebar/list';
import { useSidebarStore } from '@/stores/sidebar';

import type { SearchListProps } from '@/components/layout/searchLayout/searchSidebar/list';

export interface SearchSidebarProps {
  children?: React.ReactNode;
  isSearching: boolean;
  searchListProps: SearchListProps;
}

export default function SearchSidebar({
  children,
  isSearching,
  searchListProps,
}: SearchSidebarProps) {
  const isOpen = useSidebarStore((s) => s.open);

  return (
    <Box
      as="aside"
      backgroundColor="bg"
      borderRightWidth={{ base: 0, md: '1px' }}
      bottom={0}
      display="grid"
      gridTemplateRows="max-content 1fr"
      height={{
        base: isOpen || isSearching ? '100%' : SEARCH_INPUT_HEIGHT,
        md: 'unset',
      }}
      left={0}
      minHeight="0"
      overflow="clip"
      position={{ base: 'absolute', md: 'unset' }}
      role="search"
      transition="height 0.3s ease-in-out"
      width={{ base: '100%', md: 'unset' }}
      zIndex={{ base: 100, md: 'unset' }}
    >
      <div>{children}</div>

      <Suspense fallback={<CenterSpinner />}>
        <SearchList {...searchListProps} />
      </Suspense>
    </Box>
  );
}
