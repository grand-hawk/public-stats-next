import { Box } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import { CenterSpinner } from '@/components/common/spinners';
import { SEARCH_INPUT_HEIGHT } from '@/components/layout/searchLayout/searchSidebar/input';

export interface SearchLayoutProps {
  children?: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function SearchLayout({ children, sidebar }: SearchLayoutProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        md: '22rem 1fr',
        lg: 'var(--chakra-sizes-sm) 1fr',
      }}
      gridTemplateRows={{
        base: '1fr',
        md: '1fr',
      }}
      height="100%"
      minHeight="0"
      overflow="clip"
      position="relative"
      width="100%"
    >
      {sidebar}

      <Box
        as="main"
        marginBottom={{ base: SEARCH_INPUT_HEIGHT, md: 0 }}
        minHeight="0"
        overflow="auto"
      >
        <Suspense fallback={<CenterSpinner />}>{children}</Suspense>
      </Box>
    </Box>
  );
}
