import { Box, Span } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import CenterSpinner from '@/components/centerSpinner';

export default function Root() {
  const router = useRouter();

  return (
    <Box height="100svh">
      <Span>Test</Span>
      <CenterSpinner />
    </Box>
  );
}
