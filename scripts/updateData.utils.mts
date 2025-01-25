import ky from 'ky';

import { env } from '@scripts/updateData.env.mts';

import type { Input, Options } from 'ky';

export function request(url: Input, options: Partial<Options> = {}) {
  return ky(url, {
    prefixUrl: new URL('/api', env.INSIGHTS_API_URL),
    ...options,
    headers: {
      authorization: `Basic ${env.INSIGHTS_API_AUTH}`,
      ...options.headers,
    },
  });
}
