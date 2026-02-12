'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  httpLink,
  httpSubscriptionLink,
  loggerLink,
  splitLink,
} from '@trpc/client';
import React from 'react';
import superjson from 'superjson';

import { getBaseUrl, trpc } from '@/utils/trpc';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: process.env.NODE_ENV === 'development',
        refetchOnReconnect: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = React.useState(() => {
    const url = `${getBaseUrl()}/api/trpc`;
    const transformer = superjson;

    return trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: httpSubscriptionLink({ url, transformer }),
          false: httpLink({ url, transformer }),
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
