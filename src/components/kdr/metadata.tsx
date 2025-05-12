import { Box, Code, Spinner } from '@chakra-ui/react';
import React from 'react';

import Stat from '@/components/stat';
import { useNavigationStore } from '@/stores/navigation';
import relativeDate from '@/utils/relativeDate';
import { trpc } from '@/utils/trpc';

export default function Metadata() {
  const placeId = useNavigationStore((s) => s.placeId);
  const { isFetching, error, data } = trpc.kdr.metadata.useQuery(
    { placeId },
    { refetchOnWindowFocus: false, refetchOnMount: false },
  );

  return (
    <Box
      display="flex"
      flexDirection="row"
      height="100%"
      justifyContent="space-between"
    >
      <Stat label="Versions included">
        {placeId ? (
          isFetching ? (
            <Spinner />
          ) : error ? (
            'Error'
          ) : (
            <Code size="lg" variant="surface">
              {data?.versions.length}
            </Code>
          )
        ) : (
          '0'
        )}
      </Stat>

      <Stat
        fontSize="sm"
        fontWeight="normal"
        label="Data retrieval"
        lineHeight="unset"
      >
        {placeId ? (
          isFetching ? (
            <Spinner />
          ) : error ? (
            'Error'
          ) : (
            data && relativeDate(new Date(data.date))
          )
        ) : null}
      </Stat>
    </Box>
  );
}
