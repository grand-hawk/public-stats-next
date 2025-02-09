import { Box, Center, Link, Stack, Text } from '@chakra-ui/react';
import { useDebounce } from '@uidotdev/usehooks';
import React from 'react';

import SearchInput from '@/components/shells/search/input';
import Results from '@/components/shells/search/results';
import PlaceEmptyState from '@/components/states/placeEmptyState';
import { useNavigationStore } from '@/stores/navigation';
import { useSearchStore } from '@/stores/shells/search';

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
      <Stack gap={1}>
        <SearchInput
          disabled={!placeId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Text color="fg.subtle" fontSize="sm">
          Unix-like search commands are supported. See{' '}
          <Link
            color="fg.muted"
            href="https://www.fusejs.io/examples.html#extended-search"
          >
            extended search
          </Link>
        </Text>
      </Stack>

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
