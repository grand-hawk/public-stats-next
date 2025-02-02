import { Box } from '@chakra-ui/react';
import React from 'react';

import Navigation from '@/components/navigation';

import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box
      display="grid"
      gridTemplateRows="max-content 1fr"
      height="max-content"
      minHeight="100svh"
      width="100%"
    >
      <Navigation />

      <Box
        as="main"
        display="flex"
        justifyContent="center"
        paddingY={4}
        width="100%"
      >
        <Box maxWidth="700px" paddingX={6} width="100%">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
