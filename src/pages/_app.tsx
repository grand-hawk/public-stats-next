import Head from 'next/head';
import React from 'react';

import { Provider } from '@/components/ui/provider';
import Layout from '@/components/utils/layout';
import Umami from '@/components/utils/umami';
import { trpc } from '@/utils/trpc';

import type { AppProps } from 'next/app';

export function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MTC Stats</title>
      </Head>

      <Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>

      <Umami />
    </>
  );
}

export default trpc.withTRPC(App);
