import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import React, { Suspense } from 'react';

import DevelopmentOverlay from '@/components/development/overlay';
import SvgSymbols from '@/components/icons/symbols';
import InternalHead from '@/components/layout/head';
import RouteFallback from '@/components/layout/routeFallback';
import RouteProgress from '@/components/layout/routeProgress';
import { ChakraProvider } from '@/components/providers/chakra';
import Umami from '@/components/providers/umami';
import { Toaster } from '@/components/ui/toaster';
import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { trpc } from '@/utils/trpc';

import type { AppProps } from 'next/app';

export function App({ Component, pageProps }: AppProps) {
  const debugEnabled = useDebugEnabled();

  return (
    <>
      <InternalHead />

      <ChakraProvider>
        <NuqsAdapter>
          <RouteProgress />

          <Suspense fallback={<RouteFallback height="100svh" />}>
            <Component {...pageProps} />
          </Suspense>
        </NuqsAdapter>

        <Toaster />

        {debugEnabled && <DevelopmentOverlay />}
      </ChakraProvider>

      <SvgSymbols />

      <Umami />
    </>
  );
}

export default trpc.withTRPC(App);
