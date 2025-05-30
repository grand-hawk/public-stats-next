import {
  Bleed,
  Card,
  Center,
  FormatNumber,
  Grid,
  GridItem,
  Group,
  Heading,
  Link,
  List,
  Separator,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import BasicCard from '@/components/basicCard';
import InfoTooltip from '@/components/infoTooltip';
import Stat from '@/components/stat';
import ErrorState from '@/components/states/errorState';
import StatStack from '@/components/statStack';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { roundToNearestHalf } from '@/utils/roundToNearestHalf';
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
    { refetchOnWindowFocus: false, refetchOnMount: false },
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
            {data.amphibious === true && <Stat label="Amphibious">Yes</Stat>}
          </StatStack>
        </BasicCard>
      </GridItem>

      {Object.keys(data.turrets).length > 0 && (
        <GridItem colSpan={1} rowSpan={1}>
          <Bleed block={4} inline={4} marginY={2}>
            <Card.Root background="none" size="sm" variant="outline">
              <Card.Header>
                <Card.Title>Turrets</Card.Title>
              </Card.Header>

              <Card.Body gap={4}>
                {Object.entries(data.turrets)
                  .map(([name, turret]) => {
                    const minZoom = roundToNearestHalf(turret.zoom.min);
                    const maxZoom = roundToNearestHalf(turret.zoom.max);
                    const traverseSpeedHorizontal = roundToNearestHalf(
                      turret.traverse.speed.horizontal,
                    );
                    const traverseSpeedVertical = roundToNearestHalf(
                      turret.traverse.speed.vertical,
                    );

                    return (
                      <Stack key={name} gap={2}>
                        <BasicCard heading={name}>
                          <StatStack>
                            <Stat label="Zoom">
                              {minZoom !== maxZoom && (
                                <>
                                  <FormatNumber
                                    maximumFractionDigits={1}
                                    value={minZoom}
                                  />
                                  -
                                </>
                              )}
                              <FormatNumber
                                maximumFractionDigits={1}
                                value={maxZoom}
                              />
                              x
                            </Stat>

                            <Stat
                              label={
                                <>
                                  Traverse speed
                                  {traverseSpeedHorizontal !==
                                    traverseSpeedVertical && (
                                    <InfoTooltip
                                      content="Horizontal/vertical °/s"
                                      positioning={{ placement: 'top' }}
                                    />
                                  )}
                                </>
                              }
                            >
                              {traverseSpeedHorizontal !==
                                traverseSpeedVertical && (
                                <>
                                  <FormatNumber
                                    maximumFractionDigits={2}
                                    value={traverseSpeedHorizontal}
                                  />
                                  /
                                </>
                              )}
                              <FormatNumber
                                maximumFractionDigits={2}
                                value={traverseSpeedVertical}
                              />{' '}
                              °/s
                            </Stat>

                            <Stat label="Vertical limits">
                              <>
                                ↓
                                <FormatNumber
                                  maximumFractionDigits={2}
                                  value={turret.traverse.vertical.min}
                                />
                                °
                              </>{' '}
                              <>
                                ↑
                                <FormatNumber
                                  maximumFractionDigits={2}
                                  value={turret.traverse.vertical.max}
                                />
                                °
                              </>
                            </Stat>

                            {turret.smokes !== undefined && (
                              <Stat label="Smoke launcher(s)">
                                {turret.smokes ? 'Yes' : 'No'}
                              </Stat>
                            )}

                            {turret.stabilizer && (
                              <Stat label="Stabilizer">
                                {turret.stabilizer ? 'Yes' : 'No'}
                              </Stat>
                            )}

                            {turret.thermals !== undefined && (
                              <Stat label="Thermals">{turret.thermals}</Stat>
                            )}

                            {turret.rangefinder !== undefined && (
                              <Stat label="Rangefinder">
                                {turret.rangefinder}
                              </Stat>
                            )}

                            {(turret.lws || turret.maws) && (
                              <Stat label="Warning system(s)">
                                {[
                                  turret.lws && 'Laser',
                                  turret.maws && 'Missile',
                                ]
                                  .filter(Boolean)
                                  .join(', ')}
                              </Stat>
                            )}
                          </StatStack>
                        </BasicCard>

                        {turret.weapons.length > 0 && (
                          <Stack gap={1}>
                            <Heading size="md">Weapons</Heading>
                            <List.Root paddingInlineStart={5}>
                              {turret.weapons.map((weaponName) => (
                                <List.Item key={weaponName}>
                                  <NextLink
                                    href={`/shells?${new URLSearchParams({ query: `="${weaponName}"` })}`}
                                    passHref
                                  >
                                    <Link as="span" variant="underline">
                                      {weaponName}
                                    </Link>
                                  </NextLink>
                                </List.Item>
                              ))}
                            </List.Root>
                          </Stack>
                        )}
                      </Stack>
                    );
                  })
                  .map((item, index) => {
                    if (index === 0) return <>{item}</>;
                    return (
                      <>
                        <Separator />
                        {item}
                      </>
                    );
                  })}
              </Card.Body>
            </Card.Root>
          </Bleed>
        </GridItem>
      )}

      <GridItem colSpan={1} rowSpan={1}>
        <Bleed block={4} inline={4} marginY={2}>
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
                  {data.engine.transmission.reverseGears !== undefined && (
                    <Stat label="Reverse gears">
                      {data.engine.transmission.reverseGears}
                    </Stat>
                  )}
                  {data.engine.transmission.forwardGears !== undefined && (
                    <Stat label="Forward gears">
                      {data.engine.transmission.forwardGears}
                    </Stat>
                  )}
                  {data.engine.transmission.automatic !== undefined && (
                    <Stat label="Automatic">
                      {data.engine.transmission.automatic ? 'Yes' : 'No'}
                    </Stat>
                  )}
                </StatStack>
              </BasicCard>

              {data.suspension && (
                <BasicCard heading="Suspension">
                  <StatStack>
                    <Stat label="Roll Control">
                      {data.suspension.horizontal ? 'Yes' : 'No'}
                    </Stat>
                    <Stat label="Pitch Control">
                      {data.suspension.vertical ? 'Yes' : 'No'}
                    </Stat>
                    <Stat label="Ride Height">
                      {data.suspension.height ? 'Yes' : 'No'}
                    </Stat>
                  </StatStack>
                </BasicCard>
              )}
            </Card.Body>
          </Card.Root>
        </Bleed>
      </GridItem>
    </Grid>
  );
}
