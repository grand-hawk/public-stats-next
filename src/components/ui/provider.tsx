'use client';

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react';
import { GeistMono } from 'geist/font/mono';
import React from 'react';

import { ColorModeProvider } from '@/components/ui/color-mode';

import type { ColorModeProviderProps } from '@/components/ui/color-mode';

const config = defineConfig({
  globalCss: {
    '*': {
      scrollBehavior: 'smooth',
    },
  },
  theme: {
    tokens: {
      fonts: {
        // GeistMono.style.fontFamily has fallback
        heading: {
          value: GeistMono.style.fontFamily,
        },
        body: {
          value: GeistMono.style.fontFamily,
        },
        mono: {
          value: GeistMono.style.fontFamily,
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider forcedTheme="dark" {...props} />
    </ChakraProvider>
  );
}
