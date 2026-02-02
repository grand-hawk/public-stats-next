'use client';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

import { ColorModeProvider } from '@/components/ui/color-mode';
import system from '@/components/utils/chakra/system';

import type { ColorModeProviderProps } from '@/components/ui/color-mode';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider forcedTheme="dark" {...props} />
    </ChakraProvider>
  );
}
