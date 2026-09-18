import { useRouter } from 'next/router';
import React from 'react';

import { useRouterQuery } from '@/hooks/useRouterQuery';

export function useCanonicalSlug(
  key: string,
  slug: string,
  enabled: boolean,
): void {
  const router = useRouter();
  const query = useRouterQuery(key);

  React.useEffect(() => {
    if (!enabled || query === slug) return;

    router.replace({
      pathname: router.pathname,
      query: { ...router.query, [key]: slug },
    });
  }, [enabled, key, query, router, slug]);
}
