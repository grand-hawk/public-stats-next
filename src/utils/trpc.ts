import {
  httpLink,
  httpSubscriptionLink,
  loggerLink,
  splitLink,
} from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { ssrPrepass } from '@trpc/next/ssrPrepass';
import superjson from 'superjson';

import { IS_DEV } from '@/env';

import type { AppRouter } from '@/server/api/trpc/router';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url

  if (process.env.COOLIFY_URL) {
    const url = process.env.COOLIFY_URL.split(',')[0];
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  } // SSR should use coolify url

  const publicUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.RAILWAY_PUBLIC_DOMAIN;
  if (publicUrl) return `https://${publicUrl}`; // SSR should use public url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  ssr: true,
  ssrPrepass,
  config() {
    const url = `${getBaseUrl()}/api/trpc`;
    const transformer = superjson;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            IS_DEV ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: httpSubscriptionLink({ url, transformer }),
          false: httpLink({ url, transformer }),
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: IS_DEV,
            refetchOnReconnect: false,
          },
        },
      },
      abortOnUnmount: true,
    };
  },
  transformer: superjson,
});

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
