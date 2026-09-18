import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from 'nuqs';
import React from 'react';

import { MAX_COMPARE_ITEMS } from '@/components/features/compare/constants';

const tabParser = parseAsStringLiteral(['vehicles', 'shells']).withDefault(
  'vehicles',
);
const slugsParser = parseAsArrayOf(parseAsString).withDefault([]);

interface SlugSelection {
  slugs: string[];
  add: (slug: string) => void;
  clear: () => void;
  remove: (slug: string) => void;
}

function useSlugSelection(key: string): SlugSelection {
  const [slugs, setSlugs] = useQueryState(key, slugsParser);

  const add = React.useCallback(
    (slug: string) => {
      setSlugs((prev) => {
        if (prev.includes(slug)) return prev;
        return [...prev, slug].slice(0, MAX_COMPARE_ITEMS);
      });
    },
    [setSlugs],
  );

  const clear = React.useCallback(() => setSlugs(null), [setSlugs]);

  const remove = React.useCallback(
    (slug: string) => setSlugs((prev) => prev.filter((s) => s !== slug)),
    [setSlugs],
  );

  return { slugs: slugs.slice(0, MAX_COMPARE_ITEMS), add, clear, remove };
}

export function useCompareState() {
  const [mode, setMode] = useQueryState('tab', tabParser);
  const shells = useSlugSelection('shells');
  const vehicles = useSlugSelection('vehicles');

  const selectMode = (value: string) => {
    if (value === 'vehicles') {
      setMode('vehicles');
      shells.clear();
    } else {
      setMode('shells');
      vehicles.clear();
    }
  };

  return { mode, selectMode, shells, vehicles };
}
