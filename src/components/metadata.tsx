import { Box, Code, Spinner } from '@chakra-ui/react';
import { formatDistance } from 'date-fns';
import React from 'react';

import { StatLabel, StatRoot, StatValueText } from '@/components/ui/stat';
import { useSessionStore } from '@/stores/session';
import { trpc } from '@/utils/trpc';

import type { StatValueTextProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

function Stat({
  label,
  children,
  ...props
}: PropsWithChildren<{ label: string }> & StatValueTextProps) {
  return (
    <StatRoot>
      <StatLabel color="unset" fontWeight="medium">
        {label}
      </StatLabel>
      <Box alignItems="center" display="flex" height="100%">
        <StatValueText {...props}>{children}</StatValueText>
      </Box>
    </StatRoot>
  );
}

export default function Metadata() {
  const placeId = useSessionStore((s) => s.placeId);
  const { isFetching, error, data } = trpc.data.metadata.useQuery(
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
        ) : null}
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
