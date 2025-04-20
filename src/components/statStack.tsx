import { Stack } from '@chakra-ui/react';
import React from 'react';

import type { PropsWithChildren } from 'react';

export default function StatStack({ children }: PropsWithChildren) {
  return (
    <Stack
      css={{
        '& > .chakra-stat__root': {
          flex: '0 0 calc(var(--chakra-sizes-1\\/3) - var(--chakra-spacing-4))',
          boxSizing: 'border-box',
        },
      }}
      direction="row"
      flexWrap="wrap"
      gap={4}
    >
      {children}
    </Stack>
  );
}
