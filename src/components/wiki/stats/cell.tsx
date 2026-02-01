import { Table } from '@chakra-ui/react';
import React from 'react';

import type { TableCellProps } from '@chakra-ui/react';

export interface StatsCellProps extends TableCellProps {
  asTitle?: boolean;
  children?: React.ReactNode;
}

export function StatsCell({ asTitle, children, ...props }: StatsCellProps) {
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
