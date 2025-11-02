import { Flex, FormatNumber, Group, Link, Table } from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import NextLink from 'next/link';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import slug from 'slug';

import TeamIcon from '@/components/icons/teams';
import { EmptyState } from '@/components/ui/empty-state';
import { usePlace } from '@/hooks/usePlace';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { trpc } from '@/utils/trpc';

import type { DetailedKdrItem } from '@/server/api/trpc/routers/kdr';
import type { SortingState } from '@tanstack/react-table';

const columnHelper = createColumnHelper<DetailedKdrItem>();

const columns = [
  columnHelper.accessor('vehicle', {
    header: () => 'Vehicle',
    cell: (info) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const initials = usePlaceInitials()!;
      const vehicle = info.getValue();
      const vehicleSlug = slug(vehicle);

      return (
        <Flex alignItems="center" gap={2}>
          <TeamIcon team={info.row.original.team} />

          <Link asChild>
            <NextLink href={`/${initials}/vehicles/${vehicleSlug}`}>
              {vehicle}
            </NextLink>
          </Link>
        </Flex>
      );
    },
  }),
  columnHelper.accessor('kdr', {
    header: () => 'KDR',
    cell: (info) => (
      <FormatNumber
        maximumFractionDigits={2}
        minimumFractionDigits={2}
        value={info.getValue()}
      />
    ),
    sortDescFirst: true,
  }),
  columnHelper.accessor('kills', {
    header: () => 'Kills',
    cell: (info) => <FormatNumber value={info.getValue()} />,
  }),
  columnHelper.accessor('deaths', {
    header: () => 'Deaths',
    cell: (info) => <FormatNumber value={info.getValue()} />,
  }),
];

export default function KdrTable() {
  const place = usePlace()!;
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'kdr', desc: true },
  ]);

  const [kdr] = trpc.kdr.table.useSuspenseQuery({ placeId: place.placeId });

  const table = useReactTable({
    data: kdr,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return kdr.length > 0 ? (
    <Table.Root
      aria-label={`Vehicle kill death ratio table for ${place.placeName}`}
      css={{
        '& .chakra-table__row': {
          height: '40px',
        },
      }}
      showColumnBorder
      variant="outline"
    >
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const isSorted = header.column.getIsSorted();
              const canSort = header.column.getCanSort();

              return (
                <Table.ColumnHeader
                  key={header.id}
                  aria-sort={
                    isSorted === 'asc'
                      ? 'ascending'
                      : isSorted === 'desc'
                        ? 'descending'
                        : 'none'
                  }
                  userSelect="none"
                >
                  {canSort ? (
                    <Flex
                      alignItems="center"
                      as="button"
                      cursor="pointer"
                      display="inline-flex"
                      gap={1}
                      justifyContent="flex-start"
                      padding={0}
                      userSelect="none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      <Group
                        css={{
                          '& svg': {
                            width: 3.5,
                            height: 3.5,
                            marginY: -0.5,
                          },
                        }}
                        flexDirection="column"
                        gap={0}
                        marginLeft={1}
                      >
                        <TiArrowSortedUp
                          color={isSorted === 'asc' ? 'white' : 'gray'}
                        />
                        <TiArrowSortedDown
                          color={isSorted === 'desc' ? 'white' : 'gray'}
                        />
                      </Group>
                    </Flex>
                  ) : (
                    <Flex
                      alignItems="center"
                      gap={1}
                      justifyContent="flex-start"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Flex>
                  )}
                </Table.ColumnHeader>
              );
            })}
          </Table.Row>
        ))}
      </Table.Header>

      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ) : (
    <EmptyState icon={<GrDocumentMissing />} title="No KDR data available" />
  );
}

