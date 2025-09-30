import { Box } from '@chakra-ui/react';
import React from 'react';

import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <Box>{children}</Box>;
}
