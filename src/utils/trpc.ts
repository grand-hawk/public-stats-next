import { createTRPCReact } from '@trpc/react-query';

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

export const trpc = createTRPCReact<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
