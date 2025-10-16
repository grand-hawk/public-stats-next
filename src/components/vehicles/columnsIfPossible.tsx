import { Box } from '@chakra-ui/react';
import React from 'react';

import type { PropsWithChildren } from 'react';

export default function ColumnsIfPossible({
  children,
  pretendTwoChildren,
}: PropsWithChildren<{ pretendTwoChildren?: boolean }>) {
  const childCount = React.Children.toArray(children).filter(Boolean).length;
  const hasTwoChildren = pretendTwoChildren || childCount === 2;

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
              '& > *:nth-of-type(1)': { alignSelf: 'stretch' },
              '& > *:nth-of-type(2)': { alignSelf: 'start' },
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
