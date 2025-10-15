import { Box } from '@chakra-ui/react';
import React from 'react';

import type { PropsWithChildren } from 'react';

export default function ColumnsIfPossible({ children }: PropsWithChildren) {
  const childCount = React.Children.toArray(children).filter(Boolean).length;
  const hasTwoChildren = childCount === 2;

  return (
    <Box
      alignItems="stretch"
      css={{
        '#with-alterations &': {
          gridTemplateColumns: '1fr',
          '--columns-if-possible-display-trigger': 'block',
        },
        ...(hasTwoChildren
          ? {
              '& > *:nth-child(1)': { alignSelf: 'stretch' },
              '& > *:nth-child(2)': { alignSelf: 'start' },
            }
          : {}),
        '--columns-if-possible-display-trigger': {
          base: 'block',
          xl: 'none',
        },
      }}
      display="grid"
      gap={4}
      gridTemplateColumns={{
        base: '1fr',
        xl: hasTwoChildren ? '1fr 1fr' : '1fr',
      }}
    >
      {children}
    </Box>
  );
}
