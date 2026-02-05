import { Table } from '@chakra-ui/react';
import React from 'react';

import KdrTableCell from '@/components/features/kdr/table/cell';

import type { DetailedKdrItem } from '@/server/api/trpc/routers/kdr';
import type { TableRowProps } from '@chakra-ui/react';
import type { Row } from '@tanstack/react-table';

export default React.memo(
  function KdrTableRow({
    initials,
    range,
    row,
    ...props
  }: {
    row: Row<DetailedKdrItem>;
    initials: string;
    range: string;
  } & TableRowProps) {
    return (
      <Table.Row {...props}>
        {row.getVisibleCells().map((cell) => (
          <KdrTableCell
            key={cell.id}
            cell={cell}
            data-id={cell.id}
            initials={initials}
            range={range}
          />
        ))}
      </Table.Row>
    );
  },
  (prevProps, nextProps) =>
    prevProps.row.id === nextProps.row.id &&
    prevProps.initials === nextProps.initials &&
    prevProps.range === nextProps.range,
);
