import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { Roboto, Roboto_Mono } from 'next/font/google';

import { FOOTER_PUSH_MIN_HEIGHT } from '@/components/layout/shell/constants';
import {
  citizenDarkVars,
  citizenPagePadding,
  citizenRootVars,
} from '@/components/providers/chakra/citizenTokens';
import { recipes, slotRecipes } from '@/components/providers/chakra/recipes';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto',
});

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-mono',
});

const ref = (name: string) => ({ value: `var(${name})` });

const config = defineConfig({
  globalCss: {
    ':root': {
      colorScheme: 'dark',
      ...citizenRootVars,
      ...citizenDarkVars,
      '--scrollbar-thumb':
        'color-mix(in oklch, var(--color-base) 22%, transparent)',
      '--scrollbar-thumb--hover':
        'color-mix(in oklch, var(--color-base) 40%, transparent)',
      '--scrollbar-thumb--active':
        'color-mix(in oklch, var(--color-base) 55%, transparent)',
    },
    ...citizenPagePadding,
    html: {
      boxSizing: 'border-box',
      fontSize: '100%',
      scrollBehavior: 'smooth',
    },
    'html, body': {
      fontFamily: 'var(--font-family-base)',
      fontWeight: 'var(--font-weight-normal)',
    },
    body: {
      minHeight: '100dvh',
      color: 'var(--color-base)',
      accentColor: 'var(--accent-color-base)',
      background: 'var(--color-surface-0)',
    },
    '*': {
      '@supports not selector(::-webkit-scrollbar)': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--scrollbar-thumb) transparent',
      },
      '&::-webkit-scrollbar': { width: '10px', height: '10px' },
      '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
      '&::-webkit-scrollbar-corner': { backgroundColor: 'transparent' },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '9999px',
        border: '3px solid transparent',
        backgroundClip: 'content-box',
        backgroundColor: 'var(--scrollbar-thumb)',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'var(--scrollbar-thumb--hover)',
      },
      '&::-webkit-scrollbar-thumb:active': {
        backgroundColor: 'var(--scrollbar-thumb--active)',
      },
    },
    ':focus': { outlineColor: 'var(--color-progressive)' },
    '::placeholder': { color: 'var(--color-placeholder)' },
    '*::selection': {
      color: 'var(--color-inverted-primary)',
      backgroundColor: 'var(--color-progressive)',
    },
    '*:has(> footer[data-site-footer])': {
      display: 'flex',
      flexDirection: 'column',
      minHeight: FOOTER_PUSH_MIN_HEIGHT,
    },
    'main > *': {
      transition: 'opacity 150ms cubic-bezier(0.2, 0, 0, 1) 120ms',
    },
    'html[data-navigating] main > *': { opacity: 0.55 },
    a: { textDecoration: 'none', textUnderlineOffset: '0.25em' },
    'b, strong': { fontWeight: 'var(--font-weight-semi-bold)' },
    'h1, h2, h3, h4, h5, h6': {
      color: 'var(--color-emphasized)',
      fontWeight: 'var(--font-weight-medium)',
    },
    'h4, h5, h6': { letterSpacing: '0.0125em' },
  },
  theme: {
    keyframes: {
      'citizen-palette-in': {
        from: {
          opacity: 0,
          clipPath: 'inset(-48px -48px 100% -48px)',
          transform: 'translateY(-8px)',
        },
        to: {
          opacity: 1,
          clipPath: 'inset(-48px -48px -48px -48px)',
          transform: 'translateY(0)',
        },
      },
      'citizen-palette-out': {
        from: {
          opacity: 1,
          clipPath: 'inset(-48px -48px -48px -48px)',
          transform: 'translateY(0)',
        },
        to: {
          opacity: 0,
          clipPath: 'inset(-48px -48px 100% -48px)',
          transform: 'translateY(-8px)',
        },
      },
      'citizen-fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
      'citizen-fade-out': { from: { opacity: 1 }, to: { opacity: 0 } },
    },
    tokens: {
      fonts: {
        heading: ref('--font-family-base'),
        body: ref('--font-family-base'),
        mono: ref('--font-family-monospace'),
      },
      fontSizes: {
        xs: ref('--font-size-x-small'),
        sm: ref('--font-size-small'),
        md: ref('--font-size-medium'),
        lg: ref('--font-size-large'),
        xl: ref('--font-size-x-large'),
        '2xl': ref('--font-size-xx-large'),
        '3xl': ref('--font-size-xxx-large'),
      },
      lineHeights: {
        xs: ref('--line-height-x-small'),
        sm: ref('--line-height-small'),
        md: ref('--line-height-medium'),
        lg: ref('--line-height-large'),
        xl: ref('--line-height-x-large'),
        '2xl': ref('--line-height-xx-large'),
        '3xl': ref('--line-height-xxx-large'),
        content: ref('--line-height-content'),
      },
      fontWeights: {
        normal: ref('--font-weight-normal'),
        medium: ref('--font-weight-medium'),
        semibold: ref('--font-weight-semi-bold'),
        bold: ref('--font-weight-bold'),
      },
      radii: {
        none: { value: '0' },
        sm: ref('--border-radius-base'),
        md: ref('--border-radius-medium'),
        lg: ref('--border-radius-large'),
        full: ref('--border-radius-pill'),
      },
      borderWidths: {
        base: ref('--border-width-base'),
        thick: ref('--border-width-thick'),
      },
      sizes: {
        icon: ref('--size-icon'),
        toolbar: ref('--toolbar-size'),
        header: ref('--header-size'),
        layout: ref('--width-layout'),
      },
      shadows: {
        border: ref('--box-shadow-border'),
        small: ref('--box-shadow-small'),
        medium: ref('--box-shadow-medium'),
        large: ref('--box-shadow-large'),
      },
      durations: {
        citizenBase: ref('--transition-duration-base'),
        citizenMedium: ref('--transition-duration-medium'),
      },
      easings: {
        citizen: ref('--transition-timing-function-ease'),
        citizenIn: ref('--transition-timing-function-ease-in'),
        citizenOut: ref('--transition-timing-function-ease-out'),
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: ref('--color-surface-0'),
          subtle: ref('--color-surface-1'),
          muted: ref('--color-surface-2'),
          emphasized: ref('--color-surface-3'),
          panel: ref('--color-surface-1'),
          inverted: ref('--background-color-inverted'),
          error: ref('--background-color-destructive-subtle'),
          warning: ref('--background-color-warning-subtle'),
          success: ref('--background-color-success-subtle'),
          info: ref('--background-color-progressive-subtle'),
        },
        surface: {
          hover: ref('--color-surface-1--hover'),
          active: ref('--color-surface-1--active'),
          mutedHover: ref('--color-surface-2--hover'),
          mutedActive: ref('--color-surface-2--active'),
        },
        quiet: {
          hover: ref('--background-color-button-quiet--hover'),
          active: ref('--background-color-button-quiet--active'),
        },
        fg: {
          DEFAULT: ref('--color-base'),
          muted: ref('--color-subtle'),
          subtle: ref('--color-placeholder'),
          emphasized: ref('--color-emphasized'),
          disabled: ref('--color-disabled'),
          inverted: ref('--color-inverted'),
          error: ref('--color-destructive'),
          warning: ref('--color-warning'),
          success: ref('--color-success'),
        },
        border: {
          DEFAULT: ref('--border-color-base'),
          subtle: ref('--border-color-subtle'),
          muted: ref('--border-color-muted'),
          emphasized: ref('--border-color-interactive--hover'),
          interactive: ref('--border-color-interactive'),
          error: ref('--border-color-destructive'),
        },
        accent: {
          DEFAULT: ref('--color-progressive'),
          fg: ref('--color-inverted-primary'),
          contrast: ref('--color-inverted-primary'),
          solid: ref('--background-color-progressive'),
          solidHover: ref('--background-color-progressive--hover'),
          emphasized: ref('--color-progressive--hover'),
          subtle: ref('--background-color-progressive-subtle'),
          muted: ref('--background-color-progressive-subtle--hover'),
        },
      },
    },
    recipes,
    slotRecipes,
  },
});

export default createSystem(defaultConfig, config);
