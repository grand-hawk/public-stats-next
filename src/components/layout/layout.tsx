import { Box, Flex } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import { PageMetaHead } from '@/components/layout/pageMeta';
import BottomBar from '@/components/layout/rail/bottomBar';
import MenuCard from '@/components/layout/rail/menuCard';
import Rail from '@/components/layout/rail/rail';
import RouteFallback, {
  RouteContentReady,
} from '@/components/layout/routeFallback';
import { SiteSearchHost } from '@/components/layout/search/siteSearch';

import type { BoxProps } from '@chakra-ui/react';

export interface LayoutProps extends BoxProps {
  children?: React.ReactNode;
  noPadding?: boolean;
}

export default function Layout({ children, noPadding, ...props }: LayoutProps) {
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <PageMetaHead />

      <Flex
        css={{
          flexDirection: 'column',
          '@media (min-width: 1120px)': { flexDirection: 'row' },
        }}
        height="100svh"
        overflow="clip"
        width="100%"
      >
        <Rail triggerRef={menuTriggerRef} />

        <Box
          as="main"
          flex={1}
          minHeight={0}
          minWidth={0}
          overflow="auto"
          padding={noPadding ? undefined : { base: 2, md: 4 }}
          {...props}
          css={{
            '& > *': {
              animation:
                'citizen-fade-in 260ms cubic-bezier(0.05, 0.7, 0.1, 1) backwards',
            },
            '@media (prefers-reduced-motion: reduce)': {
              '& > *': { animation: 'none' },
            },
            ...props.css,
          }}
        >
          <Suspense fallback={<RouteFallback />}>
            {children}
            <RouteContentReady />
          </Suspense>
        </Box>

        <BottomBar triggerRef={menuTriggerRef} />
      </Flex>

      <MenuCard triggerRef={menuTriggerRef} />
      <SiteSearchHost />
    </>
  );
}
