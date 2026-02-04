'use client';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

import system from '@/components/providers/chakra/system';
import { ColorModeProvider } from '@/components/ui/color-mode';

import type { ColorModeProviderProps } from '@/components/ui/color-mode';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider forcedTheme="dark" {...props} />
    </ChakraProvider>
  );
}
