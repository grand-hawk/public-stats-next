import Head from 'next/head';
import React from 'react';

import { Provider } from '@/components/ui/provider';
import Umami from '@/components/utils/umami';
import { trpc } from '@/utils/trpc';

import type { AppProps } from 'next/app';

export function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* TODO: Use upper case place initial */}
        <title>{`${'MTC'.toUpperCase()} Stats`}</title>
      </Head>

      <Provider>
        <Component {...pageProps} />
      </Provider>

      <Umami />
    </>
  );
}

export default trpc.withTRPC(App);
