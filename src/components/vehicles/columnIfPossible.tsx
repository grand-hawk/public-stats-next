import { Box } from '@chakra-ui/react';
import React from 'react';

import type { PropsWithChildren } from 'react';

export default function ColumnIfPossible({ children }: PropsWithChildren) {
  return (
    <Box
      alignItems="start"
      display="grid"
      gap={4}
      gridTemplateColumns={{ base: '1fr', xl: '1fr 1fr' }}
    >
      {children}
    </Box>
  );
}
