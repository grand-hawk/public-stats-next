import { Box } from '@chakra-ui/react';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import React, { Suspense } from 'react';

import { CenterSpinner } from '@/components/spinners';
import { Toaster } from '@/components/ui/toaster';
import { ChakraProvider } from '@/components/utils/chakra';
import InternalHead from '@/components/utils/head';
import Umami from '@/components/utils/umami';
import UpdateListener from '@/components/utils/updateListener';
import { trpc } from '@/utils/trpc';

import type { AppProps } from 'next/app';

export function App({ Component, pageProps }: AppProps) {
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
      </ChakraProvider>

      <Umami />
    </>
  );
}

export default trpc.withTRPC(App);
