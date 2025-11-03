import { Box } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import {CenterSpinner} from '@/components/spinners';
import { SEARCH_INPUT_HEIGHT } from '@/components/searchLayout/searchSidebar/input';
import SearchList from '@/components/searchLayout/searchSidebar/list';
import { useSidebarStore } from '@/stores/sidebar';

import type { SearchListProps } from '@/components/searchLayout/searchSidebar/list';
import type { PropsWithChildren } from 'react';

export default function SearchSidebar({
  children,
  isSearching,
  searchListProps,
}: PropsWithChildren<{
  isSearching: boolean;
  searchListProps: SearchListProps;
}>) {
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
      overflow="hidden"
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
