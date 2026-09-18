import { Box } from '@chakra-ui/react';
import React from 'react';

import PaletteEmptyState from '@/components/layout/search/paletteEmptyState';
import PaletteRow from '@/components/layout/search/paletteRow';
import { SEARCH_LISTBOX_ID } from '@/components/layout/search/useSiteSearch';

import type { SiteSearchController } from '@/components/layout/search/useSiteSearch';

export default function PaletteResults({
  search,
}: {
  search: SiteSearchController;
}) {
  const {
    activeIndex,
    enabled,
    isFetching,
    listRef,
    navigate,
    results,
    setActiveIndex,
    trimmed,
  } = search;

  const showResults = enabled && results.length > 0;
  const showEmptyState = !showResults && !(enabled && isFetching);

  return (
    <Box
      ref={listRef}
      aria-label="Search results"
      id={SEARCH_LISTBOX_ID}
      role="listbox"
      css={{
        maxHeight: 'calc(100vh - 12rem)',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        paddingBlock: '8px',
      }}
    >
      {showResults && (
        <>
          <Box
            color="fg.muted"
            fontSize="14px"
            fontWeight={500}
            lineHeight="22px"
            padding="8px 16px 4px"
            role="presentation"
            textTransform="none"
          >
            Results
          </Box>
          {results.map((result, index) => (
            <PaletteRow
              key={`${result.type}-${result.href}`}
              active={index === activeIndex}
              index={index}
              onMouseEnter={() => setActiveIndex(index)}
              onSelect={() => navigate(result)}
              query={trimmed}
              result={result}
            />
          ))}
        </>
      )}
      {showEmptyState && <PaletteEmptyState empty={!enabled} query={trimmed} />}
    </Box>
  );
}
