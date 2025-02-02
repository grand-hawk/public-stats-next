import {
  Center,
  FormatNumber,
  Grid,
  GridItem,
  Group,
  Image,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import InfoTooltip from '@/components/infoTooltip';
import BasicCard from '@/components/shells/info/basicCard';
import { getIcon } from '@/components/shells/info/icons';
import PenetrationTable from '@/components/shells/info/penetrationTable';
import Stat from '@/components/stat';
import ErrorState from '@/components/states/errorState';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { trpc } from '@/utils/trpc';

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
    return (
      <EmptyState icon={<GrDocumentMissing />} title="Shell not found">
        <Group>
          <NextLink href="/shells" passHref>
            <Button variant="surface">Back to search</Button>
          </NextLink>
        </Group>
      </EmptyState>
    );

  const icon = getIcon(data.type);

  return (
    <Grid gap={4}>
      <GridItem colSpan={1} rowSpan={1}>
        <BasicCard>
          <Stack direction="row" gap={4}>
            <Stat label="Name">{data.name}</Stat>
            <Stat alignItems="center" gap={2} label="Type">
              {icon && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image asChild>
                  <NextImage
                    alt={data.type}
                    height={32}
                    quality={90}
                    src={icon}
                    width={32}
                  />
                </Image>
              )}

              {data.type}
            </Stat>
          </Stack>
        </BasicCard>
      </GridItem>

      <GridItem colSpan={1} rowSpan={1}>
        <BasicCard heading="Projectile">
          <Stack
            css={{
              '& > .chakra-stat__root': {
                flex: '0 0 calc(var(--chakra-sizes-1\\/3) - var(--chakra-spacing-4))',
                boxSizing: 'border-box',
              },
            }}
            direction="row"
            flexWrap="wrap"
            gap={4}
          >
            <Stat label="Mass">
              <FormatNumber value={data.mass} /> kg
            </Stat>
            <Stat label="Velocity">
              <FormatNumber value={data.velocity} /> m/s
            </Stat>
            <Stat label="Base damage">
              <FormatNumber value={data.damage} /> HP
            </Stat>
            {typeof data.ricochetAngle !== 'undefined' && (
              <Stat label="Ricochet angle">
                <FormatNumber value={data.ricochetAngle} />°
              </Stat>
            )}
            {typeof data.shrapMultiplier !== 'undefined' && (
              <Stat label="Shrapnel multiplier">
                <FormatNumber value={data.shrapMultiplier} />
              </Stat>
            )}
            {typeof data.eraTip !== 'undefined' && (
              <Stat
                label={
                  <>
                    ERA tip
                    <InfoTooltip content="ERA tip reduces ERA effectiveness against the penetrator" />
                  </>
                }
              >
                <FormatNumber value={data.eraTip} />
              </Stat>
            )}

            {data.explosive && (
              <>
                <Stat label="Explosive mass">
                  <FormatNumber value={data.explosive.mass} /> kg
                </Stat>
                {data.explosive.blastRadiusMultiplier && (
                  <Stat label="Blast radius multiplier">
                    <FormatNumber
                      value={data.explosive.blastRadiusMultiplier}
                    />{' '}
                    m/s
                  </Stat>
                )}
              </>
            )}
          </Stack>
        </BasicCard>
      </GridItem>

      {data.missile && (
        <GridItem colSpan={1} rowSpan={1}>
          <BasicCard heading="Missile">
            <Stack
              css={{
                '& > .chakra-stat__root': {
                  flex: '0 0 calc(var(--chakra-sizes-1\\/3) - var(--chakra-spacing-4))',
                  boxSizing: 'border-box',
                },
              }}
              direction="row"
              flexWrap="wrap"
              gap={4}
            >
              {typeof data.missile.boostTime !== 'undefined' && (
                <Stat label="Boost time">
                  <FormatNumber value={data.missile.boostTime} /> seconds
                </Stat>
              )}

              {typeof data.missile.turnRate !== 'undefined' &&
                typeof data.missile.limit === 'undefined' && (
                  <Stat label="Turn rate">
                    <FormatNumber value={data.missile.turnRate} /> °/s
                  </Stat>
                )}

              {typeof data.missile.limit !== 'undefined' && (
                <Stat label="G limit">
                  <FormatNumber value={data.missile.limit} />G
                </Stat>
              )}

              {typeof data.missile.irccm !== 'undefined' && (
                <Stat label="IRCCM">{data.missile.irccm ? 'Yes' : 'No'}</Stat>
              )}

              {typeof data.missile.unjammable !== 'undefined' && (
                <Stat label="Jammable">
                  {data.missile.unjammable ? 'No' : 'Yes'}
                </Stat>
              )}
            </Stack>
          </BasicCard>
        </GridItem>
      )}

      {data.cluster && (
        <GridItem colSpan={1} rowSpan={1}>
          <BasicCard heading="Cluster">
            <Stack direction="row" gap={4}>
              <Stat label="Submunitions">
                <FormatNumber value={data.cluster.submunitions} />x
              </Stat>
              <Stat label="Dispersion">
                <FormatNumber value={data.cluster.dispersion} />°
              </Stat>
            </Stack>
          </BasicCard>
        </GridItem>
      )}

      <GridItem colSpan={1} rowSpan={1}>
        <PenetrationTable penetration={data.penetrationTable} />
      </GridItem>
    </Grid>
  );
}
