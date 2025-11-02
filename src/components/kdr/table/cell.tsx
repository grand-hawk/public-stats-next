import { Table } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import React from 'react';

import type { DetailedKdrItem } from '@/server/api/trpc/routers/kdr';
import type { TableCellProps } from '@chakra-ui/react';
import type { Cell } from '@tanstack/react-table';

export default React.memo(
  function KdrTableCell({
    cell,
    ...props
  }: {
    cell: Cell<DetailedKdrItem, unknown>;
    initials: string;
  } & TableCellProps) {
    return (
      <Table.Cell {...props}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Table.Cell>
    );
  },
  (prevProps, nextProps) =>
    prevProps.cell.id === nextProps.cell.id &&
    prevProps.initials === nextProps.initials,
);
