import { Box, Flex } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import PlaceSwitchBar from '@/components/common/placeSwitchBar';
import { CenterSpinner } from '@/components/common/spinners';
import Sidebar from '@/components/layout/sidebar';

import type { BoxProps } from '@chakra-ui/react';

export const LAYOUT_SHIFT_MEDIA = 'md';

export interface LayoutProps extends BoxProps {
  children?: React.ReactNode;
  noPadding?: boolean;
  overwriteTabLabel?: string;
  hidePlaceSelector?: boolean;
}

export default function Layout({
  children,
  hidePlaceSelector,
  noPadding,
  overwriteTabLabel,
  ...props
}: LayoutProps) {
  return (
    <Flex justifyContent="center">
      <Box
        as="main"
        display="grid"
        gridTemplateColumns={{
          md: 'max-content 1fr',
        }}
        gridTemplateRows={{
          base: '1fr max-content',
          md: '1fr',
        }}
        height="100svh"
        maxWidth="1920px"
        overflow="clip"
        width="100%"
      >
        <Sidebar />

        <Box
          display="grid"
          gridTemplateRows="max-content 1fr"
          minHeight="0"
          overflow="clip"
        >
          {!hidePlaceSelector && (
            <PlaceSwitchBar overwriteTabLabel={overwriteTabLabel} />
          )}

          <Box
            minHeight="0"
            overflow="auto"
            padding={
              noPadding
                ? undefined
                : {
                    base: 2,
                    md: 4,
                  }
            }
            paddingTop={noPadding ? undefined : 4}
            {...props}
          >
            <Suspense fallback={<CenterSpinner />}>{children}</Suspense>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
