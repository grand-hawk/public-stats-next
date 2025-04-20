import { Box, Center } from '@chakra-ui/react';
import { useDebounce } from '@uidotdev/usehooks';
import React from 'react';

import SearchInput from '@/components/search/input';
import PlaceEmptyState from '@/components/states/placeEmptyState';
import Results from '@/components/vehicles/search/results';
import { useNavigationStore } from '@/stores/navigation';
import { useSearchStore } from '@/stores/vehicles/search';

export default function Search({
  initialQuery,
}: {
  initialQuery: string | null;
}) {
  const placeId = useNavigationStore((s) => s.placeId);
  const savedSearch = useSearchStore((s) => s.input);
  const setSavedSearch = useSearchStore((s) => s.setInput);
  const [query, setQuery] = React.useState(initialQuery || savedSearch);
  const debouncedQuery = useDebounce(query, 250);

  React.useEffect(() => {
    setSavedSearch(query || '');
  }, [setSavedSearch, query]);

  return (
    <Box
      display="grid"
      gridRowGap={4}
      gridTemplateColumns="1fr"
      gridTemplateRows="max-content 1fr"
    >
      <SearchInput
        disabled={!placeId}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <Box
        borderColor="border.muted"
        borderRadius="lg"
        borderWidth="1px"
        minHeight="250px"
        padding={3}
      >
        {placeId ? (
          <Results placeId={placeId} query={debouncedQuery} />
        ) : (
          <Center height="100%">
            <PlaceEmptyState />
          </Center>
        )}
      </Box>
    </Box>
  );
}
