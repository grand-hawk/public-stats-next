import Cache from 'stale-lru-cache';

import { IS_DEV } from '@/env';

export const createCache = <K, V>(
  revalidate: Cache.RevalidationCallback<K, V>,
) =>
  new Cache<K, V>({
    maxAge: IS_DEV ? 0 : 3600,
    staleWhileRevalidate: IS_DEV ? 0 : 86400,
    revalidate,
  });
