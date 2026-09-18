import { useRouter } from 'next/router';
import React from 'react';

import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

import type { SearchResult } from '@/server/api/trpc/routers/search';

interface UseSiteSearchOptions {
  onClose?: () => void;
  onSelect?: () => void;
}

export const SEARCH_INPUT_ID = 'site-search-input';
export const SEARCH_LISTBOX_ID = 'site-search-listbox';

export function optionId(index: number) {
  return `site-search-option-${index}`;
}

export function useSiteSearch({
  onClose,
  onSelect,
}: UseSiteSearchOptions = {}) {
  const place = usePlace();
  const router = useRouter();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(query), 120);
    return () => window.clearTimeout(id);
  }, [query]);

  const trimmed = debounced.trim();
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

  React.useEffect(() => {
    const node = listRef.current?.querySelector(`#${optionId(activeIndex)}`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, results]);

  const activeId = results[activeIndex] ? optionId(activeIndex) : undefined;

  const navigate = (result: SearchResult, newTab = false) => {
    if (newTab) {
      window.open(result.href, '_blank', 'noopener,noreferrer');
      return;
    }
    onSelect?.();
    router.push(result.href);
  };

  const reset = () => {
    setQuery('');
    setDebounced('');
    setActiveIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (query.length > 0) {
        reset();
        return;
      }
      onClose?.();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      onClose?.();
      return;
    }

    if (results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(results.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const result = results[activeIndex];
      if (result) navigate(result, event.metaKey || event.ctrlKey);
    }
  };

  return {
    activeId,
    activeIndex,
    enabled,
    handleKeyDown,
    isFetching,
    listRef,
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
