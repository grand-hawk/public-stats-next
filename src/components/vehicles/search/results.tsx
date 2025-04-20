import { Center, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { MdOutlineSearch } from 'react-icons/md';

import DelayedSpinner from '@/components/delayedSpinner';
import ErrorState from '@/components/states/errorState';
import NoDataFoundState from '@/components/states/noDataFoundState';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { trpc } from '@/utils/trpc';

function Results({ placeId, query }: { placeId: number; query: string }) {
  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = trpc.vehicles.search.useQuery(
    { placeId, query },
    { refetchOnWindowFocus: false },
  );

  if (isLoading)
    return (
      <Center height="100%">
        <DelayedSpinner size="lg" />
      </Center>
    );
  if (error)
    return <ErrorState error={error.message} onClick={() => refetch()} />;
  if (!results) return <NoDataFoundState onClick={() => refetch()} />;
  if (results.length === 0)
    return (
      <Center height="100%">
        <EmptyState
          description={
            query !== ''
              ? 'No vehicles were found'
              : 'Search for vehicles, or engine name'
          }
          icon={<MdOutlineSearch />}
          title="No results"
        />
      </Center>
    );

  return (
    <Stack gap={1} maxHeight="60vh" overflowY="auto">
      {results.map((result) => (
        <Link
          key={`${result.name}`}
          href={`/vehicles/${encodeURIComponent(result.name)}`}
          passHref
        >
          <Button
            gap={2}
            justifyContent="left"
            minHeight="fit-content"
            variant="subtle"
            width="100%"
          >
            <Text>{result.name}</Text>
          </Button>
        </Link>
      ))}
    </Stack>
  );
}

export default React.memo(Results);
