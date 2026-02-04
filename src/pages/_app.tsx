import { Box } from '@chakra-ui/react';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import React, { Suspense } from 'react';

import { CenterSpinner } from '@/components/common/spinners';
import DevelopmentOverlay from '@/components/development/overlay';
import InternalHead from '@/components/layout/head';
import { ChakraProvider } from '@/components/providers/chakra';
import Umami from '@/components/providers/umami';
import UpdateListener from '@/components/providers/updateListener';
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
          <Suspense
            fallback={
              <Box height="100svh">
                <CenterSpinner />
              </Box>
            }
          >
            <Component {...pageProps} />
          </Suspense>
        </NuqsAdapter>

        <Toaster />
        <UpdateListener />

        {debugEnabled && <DevelopmentOverlay />}
      </ChakraProvider>

      <Umami />
    </>
  );
}

export default trpc.withTRPC(App);
