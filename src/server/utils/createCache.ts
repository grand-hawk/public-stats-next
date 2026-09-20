import Cache from 'stale-lru-cache';

import { IS_DEV } from '@/env';

interface CacheOptions {
  maxAge?: number;
  staleWhileRevalidate?: number;
}

export const createCache = <K, V>(
  revalidate: Cache.RevalidationCallback<K, V>,
  { maxAge = 3600, staleWhileRevalidate = 86400 }: CacheOptions = {},
) =>
  new Cache<K, V>({
    maxAge: IS_DEV ? 0 : maxAge,
    staleWhileRevalidate: IS_DEV ? 0 : staleWhileRevalidate,
    revalidate,
  });
