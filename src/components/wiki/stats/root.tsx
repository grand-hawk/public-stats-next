import { Table } from '@chakra-ui/react';
import React from 'react';

import type { TableRootProps } from '@chakra-ui/react';

export function StatsRoot({
  children,
  css,
  ...props
}: TableRootProps & { children?: React.ReactNode }) {
  return (
    <Table.Root
      background="none"
      gap={4}
      size="sm"
      {...props}
      css={{
        '& .chakra-table__row': {
          background: 'none',
          borderBottomWidth: 1,
          borderStyle: 'dashed',
        },
        '& .chakra-table__cell, .chakra-table__columnHeader': {
          borderBottomWidth: 0,
        },
        '& .chakra-table__row:not(:nth-of-type(1)).with-padding-top .chakra-table__cell':
          {
            paddingTop: 6,
          },
        ...css,
      }}
    >
      <Table.Body>{children}</Table.Body>
    </Table.Root>
  );
}
