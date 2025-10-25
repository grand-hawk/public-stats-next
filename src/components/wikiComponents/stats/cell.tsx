import { Table } from '@chakra-ui/react';
import React from 'react';

import type { TableCellProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export function StatsCell({
  asTitle,
  children,
  ...props
}: PropsWithChildren<
  TableCellProps & {
    asTitle?: boolean;
  }
>) {
  return (
    <Table.Cell
      color={asTitle ? 'fg' : undefined}
      fontWeight={asTitle ? 'medium' : undefined}
      {...props}
    >
      {children}
    </Table.Cell>
  );
}
