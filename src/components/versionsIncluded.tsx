import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

import { StatLabel, StatRoot, StatValueText } from '@/components/ui/stat';
import { useSessionStore } from '@/stores/session';
import { trpc } from '@/utils/trpc';

export default function VersionsIncluded() {
  const placeId = useSessionStore((s) => s.placeId);
  const { isFetching, error, data } = trpc.data.unique.useQuery(
    { placeId },
    { refetchOnWindowFocus: false },
  );

  return (
    <StatRoot height="100%">
      <StatLabel color="unset" fontWeight="medium">
        Versions included
      </StatLabel>
      <Box alignItems="center" display="flex" height="100%">
        <StatValueText>
          {placeId ? (
            isFetching ? (
              <Spinner />
            ) : error ? (
              'Error'
            ) : (
              data?.versions.length
            )
          ) : null}
        </StatValueText>
      </Box>
    </StatRoot>
  );
}
