import React from 'react';

export interface FacetedProcedure<TInput, TData> {
  useQuery(
    input: TInput,
    options: {
      placeholderData: (previous: TData | undefined) => TData | undefined;
    },
  ): { data: TData | undefined };
  useSuspenseQuery(input: TInput): [TData, { isFetching: boolean }];
}

export interface FacetedSearch<TResults, TFacets> {
  facets: TFacets;
  isSearching: boolean;
  results: TResults;
}

export function useFacetedSearch<TInput, TResults, TFacets>(
  searchInput: TInput,
  search: FacetedProcedure<TInput, TResults>,
  searchFacets: FacetedProcedure<TInput, TFacets>,
): FacetedSearch<TResults, TFacets> {
  const deferredInput = React.useDeferredValue(searchInput);
  const [initialInput] = React.useState(searchInput);

  const [results, resultsQuery] = search.useSuspenseQuery(deferredInput);

  const [initialFacets] = searchFacets.useSuspenseQuery(initialInput);
  const { data: liveFacets } = searchFacets.useQuery(deferredInput, {
    placeholderData: (previous) => previous,
  });

  return {
    facets: liveFacets ?? initialFacets,
    isSearching: resultsQuery.isFetching || searchInput !== deferredInput,
    results,
  };
}
