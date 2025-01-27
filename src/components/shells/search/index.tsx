import { Box, Center } from '@chakra-ui/react';
import React from 'react';

import SearchInput from '@/components/shells/search/input';
import Results from '@/components/shells/search/results';
import PlaceEmptyState from '@/components/states/placeEmptyState';
import { useNavigationStore } from '@/stores/navigation';

export default function Search() {
  const placeId = useNavigationStore((s) => s.placeId);
  const [query, setQuery] = React.useState('');

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
        onChange={(e) => setQuery(e.target.value)}
      />

      <Box
        borderColor="border.muted"
        borderRadius="lg"
        borderWidth="1px"
        padding={3}
      >
        {placeId ? (
          <Results placeId={placeId} query={query} />
        ) : (
          <Center height="100%">
            <PlaceEmptyState />
          </Center>
        )}
      </Box>
    </Box>
  );
}
