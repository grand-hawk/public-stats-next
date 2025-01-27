import { Box, Center } from '@chakra-ui/react';
import { useDebounce } from '@uidotdev/usehooks';
import React from 'react';

import SearchInput from '@/components/shells/search/input';
import Results from '@/components/shells/search/results';
import PlaceEmptyState from '@/components/states/placeEmptyState';
import { useNavigationStore } from '@/stores/navigation';

export default function Search({
  initialQuery,
}: {
  initialQuery: string | null;
}) {
  const placeId = useNavigationStore((s) => s.placeId);
  const [query, setQuery] = React.useState(initialQuery || '');
  const debouncedQuery = useDebounce(query, 250);

  return (
    <Box
      display="grid"
      gridRowGap={4}
      gridTemplateColumns="1fr"
      gridTemplateRows="max-content 1fr"
    >
      <SearchInput
        disabled={!placeId}
        setValue={(value) => setQuery(value)}
        value={query}
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
