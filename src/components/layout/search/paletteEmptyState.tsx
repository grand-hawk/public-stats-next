import { Box, Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { LuSearch, LuSearchX } from 'react-icons/lu';

export default function PaletteEmptyState({
  empty,
  query,
}: {
  empty: boolean;
  query: string;
}) {
  return (
    <Flex
      alignItems="center"
      direction="column"
      gap="12px"
      justifyContent="center"
      padding="32px 16px"
      role="status"
      textAlign="center"
    >
      <Icon
        as={empty ? LuSearch : LuSearchX}
        boxSize="80px"
        color="fg.muted"
        strokeWidth={1}
      />
      <Box>
        <Box color="fg.emphasized" fontSize="18px" fontWeight={600}>
          {empty ? 'Search the MTC wiki' : `Uh oh! No results for “${query}”`}
        </Box>
        <Box color="fg.muted" fontSize="16px" lineHeight="26px">
          {empty
            ? 'Find a vehicle, a shell, a team or a loadout.'
            : 'Try a different keyword or check the spelling.'}
        </Box>
      </Box>
    </Flex>
  );
}
