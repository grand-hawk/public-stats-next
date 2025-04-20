import {
  Bleed,
  Card,
  Center,
  FormatNumber,
  Grid,
  GridItem,
  Group,
  Spinner,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import BasicCard from '@/components/basicCard';
import Stat from '@/components/stat';
import ErrorState from '@/components/states/errorState';
import StatStack from '@/components/statStack';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { trpc } from '@/utils/trpc';

export default function VehicleInfo({
  placeId,
  vehicle,
}: {
  placeId: number;
  vehicle: string;
}) {
  const { data, isFetching, error, refetch } = trpc.vehicles.data.useQuery(
    { placeId, vehicle },
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
    return (
      <EmptyState icon={<GrDocumentMissing />} title="Vehicle not found">
        <Group>
          <NextLink href="/vehicles" passHref>
            <Button variant="surface">Back to search</Button>
          </NextLink>
        </Group>
      </EmptyState>
    );

  return (
    <Grid gap={4}>
      <GridItem colSpan={1} rowSpan={1}>
        <Alert status="info" title="This page is still under construction!" />
      </GridItem>

      <GridItem colSpan={1} rowSpan={1}>
        <BasicCard heading="Vehicle">
          <StatStack>
            <Stat label="Mass">
              <FormatNumber value={data.mass} /> tonne
            </Stat>
          </StatStack>
        </BasicCard>
      </GridItem>

      <GridItem colSpan={1} rowSpan={1}>
        <Bleed block={4} inline={4} marginTop={2}>
          <Card.Root background="none" size="sm" variant="outline">
            <Card.Body gap={4}>
              <BasicCard heading="Engine">
                <StatStack>
                  <Stat label="Name">{data.engine.name}</Stat>
                  <Stat label="Type">{data.engine.type}</Stat>
                  <Stat label="Power">
                    <FormatNumber value={data.engine.horsepower} /> hp
                  </Stat>
                  <Stat label="Max RPM">
                    <FormatNumber value={data.engine.maxRPM} /> RPM
                  </Stat>
                  <Stat label="Reverse speed">
                    <FormatNumber value={data.engine.reverseSpeed} /> km/h
                  </Stat>
                  <Stat label="Forward speed">
                    <FormatNumber value={data.engine.forwardSpeed} /> km/h
                  </Stat>
                </StatStack>
              </BasicCard>

              <BasicCard heading="Transmission">
                <StatStack>
                  <Stat label="Neutral steering">
                    {data.engine.transmission.neutralSteering ? 'Yes' : 'No'}
                  </Stat>
                  <Stat label="Reverse gears">
                    {data.engine.transmission.reverseGears}
                  </Stat>
                  <Stat label="Forward gears">
                    {data.engine.transmission.forwardGears}
                  </Stat>
                </StatStack>
              </BasicCard>
            </Card.Body>
          </Card.Root>
        </Bleed>
      </GridItem>
    </Grid>
  );
}
