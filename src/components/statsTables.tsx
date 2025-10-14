import { Table } from '@chakra-ui/react';
import React from 'react';

export type Table = Array<Row | undefined>;
export type Row = [string, ...React.ReactNode[]];

export default function StatsTable({
  tables,
}: {
  tables: Array<Table | undefined>;
}) {
  return (
    <Table.Root
      background="none"
      clear="both"
      css={{
        '& .chakra-table__row': {
          background: 'none',
          borderBottomWidth: 1,
          borderStyle: 'dashed',
        },
        '& .chakra-table__cell, .chakra-table__columnHeader': {
          borderBottomWidth: 0,
        },
      }}
      gap={4}
      size="sm"
    >
      <Table.Body>
        {(tables.filter(Boolean) as Table[]).map((table, tableIndex) =>
          (table.filter(Boolean) as Row[]).map((row, rowIndex) => (
            <Table.Row key={`${tableIndex}-${row[0]}`}>
              {row.map((value, columnIndex) => {
                const isFirst = columnIndex === 0 && rowIndex === 0;

                return (
                  <Table.Cell
                    key={columnIndex}
                    color={isFirst ? 'fg' : undefined}
                    fontWeight={isFirst ? 'medium' : undefined}
                    paddingInlineStart={
                      columnIndex === 0 && rowIndex !== 0 ? 6 : undefined
                    }
                    paddingTop={
                      rowIndex === 0 && tableIndex !== 0 ? 8 : undefined
                    }
                  >
                    {value}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          )),
        )}
      </Table.Body>
    </Table.Root>
  );
}
