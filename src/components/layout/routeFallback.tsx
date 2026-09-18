import { Box } from '@chakra-ui/react';
import React from 'react';

import { CenterSpinner } from '@/components/common/spinners';
import { routeContentReady } from '@/stores/routeProgress';

import type { BoxProps } from '@chakra-ui/react';

export default function RouteFallback(props: BoxProps) {
  return (
    <Box
      data-route-fallback
      height="100%"
      {...props}
      css={{
        '&&': {
          animation: 'citizen-fade-in 200ms ease 350ms backwards',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '&&': { animation: 'none' },
        },
      }}
    >
      <CenterSpinner />
    </Box>
  );
}

export function RouteContentReady() {
  React.useLayoutEffect(() => {
    routeContentReady();
  }, []);

  return null;
}
