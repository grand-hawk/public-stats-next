import React from 'react';

import ShellFilterPanel from '@/components/features/shells/browse/filterPanel';
import { useShellFilters } from '@/components/features/shells/browse/useShellFilters';
import VirtualShellResults from '@/components/features/shells/browse/virtualShellResults';
import ArticleLayout from '@/components/layout/articleLayout';
import EmptyResults from '@/components/ui/emptyResults';
import FilterSheet from '@/components/ui/filters/sheet';
import { useFacetedSearch } from '@/components/ui/filters/useFacetedSearch';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

import type {
  ShellSearchFacets,
  ShellsListForBrowse,
} from '@/server/api/trpc/routers/shells';

export default function ShellsSearch() {
  const place = usePlace()!;
  const filters = useShellFilters();

  const { facets, isSearching, results } = useFacetedSearch<
    typeof filters.searchInput,
    ShellsListForBrowse,
    ShellSearchFacets
  >(filters.searchInput, trpc.shells.search, trpc.shells.searchFacets);

  const weapons = Object.values(results);
  const shellCount = weapons.reduce(
    (total, shells) => total + shells.length,
    0,
  );
  const resultLabel = `${shellCount} shells`;

  const filterPanel = (
    <ShellFilterPanel
      facets={facets}
      filters={filters}
      pending={isSearching}
      resultLabel={resultLabel}
    />
  );

  return (
    <ArticleLayout
      placeName={place.placeName}
      sidebar={filterPanel}
      subtitle={`From the ${place.placeName} wiki`}
      title="Shells"
    >
      <FilterSheet
        activeCount={filters.activeCount}
        query={filters.query}
        resultLabel={resultLabel}
        searchPlaceholder="Search shells"
        onQueryChange={filters.setQuery}
      >
        {filterPanel}
      </FilterSheet>

      {weapons.length === 0 ? (
        <EmptyResults
          hasFilters={filters.hasFilters}
          message="No shells match your filters."
          onClearAll={filters.clearAll}
        />
      ) : (
        <VirtualShellResults
          filtered={results}
          placeInitials={place.initials}
        />
      )}
    </ArticleLayout>
  );
}
