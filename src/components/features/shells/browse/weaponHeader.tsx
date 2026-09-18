import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

import { HEADING_HEIGHT } from '@/components/features/shells/browse/row';

export default function WeaponHeader({ weapon }: { weapon: string }) {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'flex-end',
        height: `${HEADING_HEIGHT}px`,
        paddingBlock: '16px 6px',
      }}
    >
      <Heading
        as="h2"
        color="fg.emphasized"
        css={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '1.5rem',
          fontWeight: 500,
          lineHeight: '34px',
          marginBlock: 0,
        }}
      >
        {weapon}
      </Heading>
    </Box>
  );
}
