import { Box } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import { CenterSpinner } from '@/components/spinners';
import { ChakraProvider } from '@/components/utils/chakra';
import Head from '@/components/utils/head';
import Umami from '@/components/utils/umami';
import { trpc } from '@/utils/trpc';

import type { AppProps } from 'next/app';

export function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head />

      <ChakraProvider>
        <Suspense
          fallback={
            <Box height="100svh">
              <CenterSpinner />
            </Box>
          }
        >
          <Component {...pageProps} />
        </Suspense>
      </ChakraProvider>

      <Umami />
    </>
  );
}

export default trpc.withTRPC(App);
