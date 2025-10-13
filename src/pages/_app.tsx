import { Box } from '@chakra-ui/react';
// import { useIsClient } from '@uidotdev/usehooks';
import React, { Suspense } from 'react';

import CenterSpinner from '@/components/centerSpinner';
import Head from '@/components/head';
import { Provider } from '@/components/ui/provider';
import Umami from '@/components/utils/umami';
// import { usePersistStoreIsHydrated } from '@/hooks/usePersistStoreIsHydrated';
// import { useVehicleSearchStore } from '@/stores/vehicles/search';
import { trpc } from '@/utils/trpc';

import type { AppProps } from 'next/app';

export function App({ Component, pageProps }: AppProps) {
  // const isClient = useIsClient();
  // const persistedStores = [useVehicleSearchStore];
  // const persistedStoresAreHydrated = persistedStores.every(
  //   usePersistStoreIsHydrated,
  // );

  return (
    <>
      <Head />

      <Provider>
        <Suspense
          fallback={
            <Box height="100svh">
              <CenterSpinner />
            </Box>
          }
        >
          <Component {...pageProps} />
        </Suspense>
      </Provider>

      <Umami />
    </>
  );
}

export default trpc.withTRPC(App);
