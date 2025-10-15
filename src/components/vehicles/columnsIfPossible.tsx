import { Box } from '@chakra-ui/react';
import React from 'react';

import type { PropsWithChildren } from 'react';

export default function ColumnsIfPossible({ children }: PropsWithChildren) {
  return (
    <Box
      alignItems="stretch"
      css={{
        '#with-alterations &': {
          gridTemplateColumns: '1fr',
        },
        '& > *:nth-child(1)': {
          alignSelf: 'stretch',
        },
        '& > *:nth-child(2)': {
          alignSelf: 'start',
        },
      }}
      display="grid"
      gap={4}
      gridTemplateColumns={{ base: '1fr', xl: '1fr 1fr' }}
    >
      {children}
    </Box>
  );
}
