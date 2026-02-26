import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { GeistMono } from 'geist/font/mono';

import {
  recipes,
  slotRecipes,
} from '@/components/providers/chakra/recipes';

const config = defineConfig({
  globalCss: {
    '*': {
      scrollBehavior: 'smooth',
      _scrollbar: {
        width: '8px',
      },
      _scrollbarThumb: {
        backgroundColor: 'fg.subtle',
      },
      _scrollbarTrack: {
        backgroundColor: 'bg.subtle',
      },
    },
    '*::selection': {
      backgroundColor: 'blue.600/60',
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
    semanticTokens: {
      colors: {
        bg: {
          muted: {
            value: '#1a1a1a',
          },
        },
      },
    },
    recipes,
    slotRecipes,
  },
});

export default createSystem(defaultConfig, config);
