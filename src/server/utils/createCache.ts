import Cache from 'stale-lru-cache';

import { env } from '@/env';

export const createCache = <K, V>(
  revalidate: Cache.RevalidationCallback<K, V>,
) =>
  new Cache<K, V>({
    maxAge: env.NODE_ENV === 'development' ? 0 : 3600,
    staleWhileRevalidate: env.NODE_ENV === 'development' ? 0 : 86400,
    revalidate,
  });
