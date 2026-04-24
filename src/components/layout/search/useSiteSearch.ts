import { useRouter } from 'next/router';
import React from 'react';

import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

import type { SearchResult } from '@/server/api/trpc/routers/search';

interface UseSiteSearchOptions {
  onSelect?: () => void;
}

export function useSiteSearch({ onSelect }: UseSiteSearchOptions = {}) {
  const place = usePlace();
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const deferredQuery = React.useDeferredValue(query);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const trimmed = deferredQuery.trim();
  const enabled = !!place && trimmed.length >= 2;

  const { data: results = [], isFetching } = trpc.search.query.useQuery(
    {
      placeId: place?.placeId ?? '',
      q: trimmed,
    },
    {
      enabled,
      staleTime: 60_000,
      placeholderData: (prev) => prev,
    },
  );

  React.useEffect(() => {
    setActiveIndex(0);
  }, [trimmed]);

  const navigate = React.useCallback(
    (result: SearchResult) => {
      onSelect?.();
      router.push(result.href);
    },
    [onSelect, router],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (results.length === 0) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const r = results[activeIndex];
        if (r) navigate(r);
      }
    },
    [activeIndex, navigate, results],
  );

  const reset = React.useCallback(() => {
    setQuery('');
    setActiveIndex(0);
  }, []);

  return {
    activeIndex,
    enabled,
    handleKeyDown,
    isFetching,
    navigate,
    query,
    reset,
    results,
    setActiveIndex,
    setQuery,
    trimmed,
  };
}

export type SiteSearchController = ReturnType<typeof useSiteSearch>;
