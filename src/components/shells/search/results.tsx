import { Center, Stack, Text } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
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
  const autoAnimateRef = React.useRef<HTMLDivElement>(null);
  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = trpc.shells.search.useQuery(
    { placeId, query },
    { refetchOnWindowFocus: false },
  );

  React.useEffect(() => {
    if (!autoAnimateRef.current) return;
    autoAnimate(autoAnimateRef.current);
  }, [autoAnimateRef]);

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
            query !== '' ? 'No shells were found' : 'Start by inputting a query'
          }
          icon={<MdOutlineSearch />}
          title="No results"
        />
      </Center>
    );

  return (
    <Stack ref={autoAnimateRef} gap={1} maxHeight="60vh" overflow="auto">
      {results.map((result, index) => (
        <Link
          key={`${result.weaponName}-${result.shell}-${index}`}
          href={`/shells/${result.weaponName}/${result.shell}`}
          passHref
        >
          <Button
            gap={2}
            justifyContent="left"
            minHeight="fit-content"
            variant="subtle"
            width="100%"
          >
            <Text>{result.shell}</Text>

            <Text color="fg.muted" fontSize="sm" fontWeight="normal">
              {result.weaponName}
            </Text>
          </Button>
        </Link>
      ))}
    </Stack>
  );
}

export default React.memo(Results);
