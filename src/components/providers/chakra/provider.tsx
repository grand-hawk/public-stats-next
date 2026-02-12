'use client';

import { ChakraProvider } from '@chakra-ui/react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import React from 'react';

import system from '@/components/providers/chakra/system';
import { ColorModeProvider } from '@/components/ui/color-mode';

import type { ColorModeProviderProps } from '@/components/ui/color-mode';

function useEmotionCache() {
  const [cache] = React.useState(() => {
    const c = createCache({ key: 'css' });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;

    const names: string[] = [];
    let styles = '';
    for (const [name, value] of entries) {
      if (typeof value === 'string') {
        names.push(name);
        styles += value;
      }
    }

    return (
      <style
        dangerouslySetInnerHTML={{ __html: styles }}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        key={cache.key}
      />
    );
  });

  return cache;
}

export function Provider(props: ColorModeProviderProps) {
  const cache = useEmotionCache();

  return (
    <CacheProvider value={cache}>
      <ChakraProvider value={system}>
        <ColorModeProvider forcedTheme="dark" {...props} />
      </ChakraProvider>
    </CacheProvider>
  );
}
