import { Box, Code, Spinner } from '@chakra-ui/react';
import { formatDistance } from 'date-fns';
import React from 'react';

import Stat from '@/components/stat';
import { usePlaceSelectStore } from '@/stores/placeSelect';
import { trpc } from '@/utils/trpc';

export default function Metadata() {
  const placeId = usePlaceSelectStore((s) => s.placeId);
  const { isFetching, error, data } = trpc.kdr.metadata.useQuery(
    { placeId },
    { refetchOnWindowFocus: false },
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
            data &&
            formatDistance(new Date(data.date), new Date(), {
              addSuffix: true,
            })
          )
        ) : null}
      </Stat>
    </Box>
  );
}
