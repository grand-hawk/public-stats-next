import { Code, FormatNumber, IconButton, Link, Table } from '@chakra-ui/react';
import { Group, Spinner } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';

import ErrorState from '@/components/states/errorState';
import NoDataFoundState from '@/components/states/noDataFoundState';
import { trpc } from '@/utils/trpc';

export default function VehicleTable({ placeId }: { placeId: number }) {
  const [sortKey, setSortKey] =
    React.useState<keyof NonNullable<typeof kdr>[0]>('kd');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'desc',
  );
  const {
    data: kdr,
    isFetching,
    error,
    refetch,
  } = trpc.kdr.kdr.useQuery(
    { placeId },
    { refetchOnWindowFocus: false, refetchOnMount: false },
  );

  const sortedKdr = React.useMemo(
    () =>
      kdr &&
      [...kdr].sort((a, b) => {
        const alphabetical = sortKey === 'name';

        switch (sortDirection) {
          case 'asc':
            if (alphabetical) return a.name.localeCompare(b.name);
            return a[sortKey] - b[sortKey];
          case 'desc':
            if (alphabetical) return b.name.localeCompare(a.name);
            return b[sortKey] - a[sortKey];
        }
      }),
    [kdr, sortKey, sortDirection],
  );

  if (isFetching) return <Spinner size="lg" />;
  if (error)
    return (
      <ErrorState
        error={error.message}
        onClick={() => !isFetching && refetch()}
      />
    );
  if (!sortedKdr)
    return <NoDataFoundState onClick={() => !isFetching && refetch()} />;

  const SortButton = ({ name }: { name: typeof sortKey }) => {
    return (
      <IconButton
        css={{
          '& :where(svg)': {
            width: 3.5,
            height: 3.5,
            marginY: -0.5,
          },
        }}
        float="right"
        fontSize="0.5em"
        height="min-content"
        size="xs"
        variant="ghost"
        width="min-content"
        onClick={() => {
          if (sortKey === name)
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
          else setSortKey(name);
        }}
      >
        <Group flexDirection="column" gap={0}>
          <TiArrowSortedUp
            color={
              sortKey === name && sortDirection === 'asc' ? 'white' : 'gray'
            }
          />
          <TiArrowSortedDown
            color={
              sortKey === name && sortDirection === 'desc' ? 'white' : 'gray'
            }
          />
        </Group>
      </IconButton>
    );
  };

  return (
    <Table.ScrollArea height="100%" width="100%">
      <Table.Root borderRadius="md" shadow="none" size="sm" variant="outline">
        <Table.Header>
          <Table.Row background="bg.muted">
            <Table.ColumnHeader>
              Vehicle <SortButton name="name" />
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              K/D Ratio <SortButton name="kd" />
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              Kills <SortButton name="kills" />
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              Deaths <SortButton name="deaths" />
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedKdr.map(({ name, kd, kills, deaths }) => (
            <Table.Row key={name}>
              <Table.Cell>
                <NextLink
                  href={`/vehicles/${encodeURIComponent(name)}`}
                  passHref
                >
                  <Link as="span">{name}</Link>
                </NextLink>
              </Table.Cell>
              <Table.Cell>
                <Code color="white" size="md">
                  {kd}
                </Code>
              </Table.Cell>
              <Table.Cell>
                <Code color="white" size="md">
                  <FormatNumber value={kills} />
                </Code>
              </Table.Cell>
              <Table.Cell>
                <Code color="white" size="md">
                  <FormatNumber value={deaths} />
                </Code>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
