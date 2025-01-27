import {
  Card,
  Center,
  FormatNumber,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Stack,
  Table,
} from '@chakra-ui/react';
import React from 'react';

import Stat from '@/components/stat';
import ErrorState from '@/components/states/errorState';
import NoDataFoundState from '@/components/states/noDataFoundState';
import { trpc } from '@/utils/trpc';

import type { HeadingProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

function BasicCard({
  heading,
  headingProps,
  children,
}: PropsWithChildren<{ heading?: string; headingProps?: HeadingProps }>) {
  return (
    <div>
      {heading && (
        <Heading size="lg" {...headingProps} paddingBottom={1}>
          {heading}
        </Heading>
      )}

      <Card.Root size="sm" variant="subtle" width="100%">
        <Card.Body>{children}</Card.Body>
      </Card.Root>
    </div>
  );
}

export default function ShellInfo({
  placeId,
  weapon,
  shell,
}: {
  placeId: number;
  weapon: string;
  shell: string;
}) {
  const { data, isFetching, error, refetch } = trpc.shells.data.useQuery(
    { placeId, weapon, shell },
    { refetchOnWindowFocus: false },
  );

  if (isFetching)
    return (
      <Center minHeight="200px">
        <Spinner />
      </Center>
    );
  if (error)
    return (
      <ErrorState
        error={error.message}
        onClick={() => !isFetching && refetch()}
      />
    );
  if (!data)
    return <NoDataFoundState onClick={() => !isFetching && refetch()} />;

  return (
    <Grid gap={4}>
      <GridItem colSpan={1} rowSpan={1}>
        <BasicCard>
          <Stack direction="row" gap={4}>
            <Stat label="Name">{data.name}</Stat>
            <Stat label="Type">{data.type}</Stat>
          </Stack>
        </BasicCard>
      </GridItem>

      <GridItem colSpan={1} rowSpan={1}>
        <BasicCard heading="Projectile">
          <Stack direction="row" gap={2}>
            <Stat label="Mass">
              <FormatNumber value={data.mass} /> kg
            </Stat>
            <Stat label="Velocity">
              <FormatNumber value={data.velocity} /> m/s
            </Stat>
            <Stat label="Base damage">
              <FormatNumber value={data.damage} /> HP
            </Stat>
          </Stack>
        </BasicCard>
      </GridItem>

      <GridItem colSpan={1} rowSpan={1}>
        <BasicCard heading="Penetration">
          <Table.ScrollArea height="100%" width="100%">
            <Table.Root showColumnBorder>
              <Table.Header>
                <Table.Row background="none">
                  <Table.ColumnHeader>Distance</Table.ColumnHeader>
                  <Table.ColumnHeader>Penetration</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>soon</Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </BasicCard>
      </GridItem>
    </Grid>
  );
}
