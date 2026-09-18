import React from 'react';

import VehicleFilterPanel from '@/components/features/vehicles/browse/filterPanel';
import VehicleGrid from '@/components/features/vehicles/browse/grid';
import { useVehicleFilters } from '@/components/features/vehicles/browse/useVehicleFilters';
import ArticleLayout from '@/components/layout/articleLayout';
import EmptyResults from '@/components/ui/emptyResults';
import FilterSheet from '@/components/ui/filters/sheet';
import { useFacetedSearch } from '@/components/ui/filters/useFacetedSearch';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

import type {
  ListVehicle,
  VehicleSearchFacets,
} from '@/server/api/trpc/routers/vehicles';

export interface VehiclesSearchProps {
  defaultClassifications?: string[];
  title?: string;
}

export default function VehiclesSearch({
  defaultClassifications,
  title = 'Vehicles',
}: VehiclesSearchProps = {}) {
  const place = usePlace()!;
  const filters = useVehicleFilters(defaultClassifications);

  const { facets, isSearching, results } = useFacetedSearch<
    typeof filters.searchInput,
    ListVehicle[],
    VehicleSearchFacets
  >(filters.searchInput, trpc.vehicles.search, trpc.vehicles.searchFacets);

  const resultLabel = `${results.length} vehicles`;

  const filterPanel = (
    <VehicleFilterPanel
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
      title={title}
    >
      <FilterSheet
        activeCount={filters.activeCount}
        query={filters.query}
        resultLabel={resultLabel}
        searchPlaceholder="Search vehicles"
        onQueryChange={filters.setQuery}
      >
        {filterPanel}
      </FilterSheet>

      {results.length === 0 ? (
        <EmptyResults
          hasFilters={filters.hasFilters}
          message="No vehicles match your filters."
          onClearAll={filters.clearAll}
        />
      ) : (
        <VehicleGrid placeInitials={place.initials} vehicles={results} />
      )}
    </ArticleLayout>
  );
}
