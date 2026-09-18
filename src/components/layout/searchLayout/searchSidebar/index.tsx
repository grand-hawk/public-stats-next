import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import { CenterSpinner } from '@/components/common/spinners';
import { SEARCH_BAR_HEIGHT } from '@/components/layout/searchLayout/searchSidebar/input';
import { GLASS_SURFACE_CSS } from '@/components/ui/styles';
import { useSidebarStore } from '@/stores/sidebar';

import type { SearchListProps } from '@/components/layout/searchLayout/searchSidebar/list';

const SearchList = dynamic(
  () => import('@/components/layout/searchLayout/searchSidebar/list'),
  { ssr: false, loading: () => <CenterSpinner /> },
);

const SIDEBAR_DESKTOP_MEDIA = '@media (min-width: 48em)';
const SIDEBAR_MOBILE_MEDIA = '@media (max-width: 47.99em)';

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
      bottom={0}
      display="grid"
      gridTemplateRows="max-content 1fr"
      height={{
        base: isOpen || isSearching ? '100%' : SEARCH_BAR_HEIGHT,
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
      css={{
        backgroundColor: 'var(--color-surface-0)',
        [SIDEBAR_DESKTOP_MEDIA]: {
          borderInlineEnd: '1px solid var(--border-color-base)',
        },
        [SIDEBAR_MOBILE_MEDIA]: {
          borderTop: '1px solid var(--border-color-base)',
          borderStartStartRadius: '8px',
          borderStartEndRadius: '8px',
          ...GLASS_SURFACE_CSS,
          boxShadow: 'var(--box-shadow-large)',
        },
      }}
    >
      <div>{children}</div>

      <SearchList {...searchListProps} />
    </Box>
  );
}
