import { FormatNumber, Stack, Table, Text } from '@chakra-ui/react';
import React from 'react';

import BasicCard from '@/components/shells/info/basicCard';
import { Switch } from '@/components/ui/switch';
import { Tooltip } from '@/components/ui/tooltip';
import relativePenetration from '@/utils/relativePenetration';

import type { Shell } from '@/server/api/trpc/routers/shells';

export default function PenetrationTable({
  penetration,
}: {
  penetration: NonNullable<Shell['penetrationTable']>;
}) {
  const [mode, setMode] = React.useState<'los' | 'rel'>('los');

  const angles = Object.keys(penetration).map((angle) => Number(angle));
  angles.sort((a, b) => a - b);

  const distances = Object.keys(penetration[angles[0]]).map((distance) =>
    Number(distance),
  );
  distances.sort((a, b) => a - b);

  return (
    <BasicCard
      heading={
        <Stack
          alignItems="center"
          direction="row"
          gap={2}
          justifyContent="space-between"
        >
          <Text>Penetration</Text>

          <Stack alignItems="center" direction="row" gap={2}>
            <Tooltip
              closeDelay={30}
              content="Line of sight penetration"
              openDelay={15}
            >
              <Text fontSize="sm" fontWeight="normal">
                LOS
              </Text>
            </Tooltip>

            <Switch
              checked={mode === 'rel'}
              onCheckedChange={(event) =>
                setMode(event.checked ? 'rel' : 'los')
              }
            />

            <Tooltip
              closeDelay={30}
              content="Relative (plate) penetration"
              openDelay={15}
              positioning={{
                placement: 'bottom-end',
              }}
            >
              <Text fontSize="sm" fontWeight="normal">
                REL
              </Text>
            </Tooltip>
          </Stack>
        </Stack>
      }
    >
      <Table.ScrollArea height="100%" width="100%">
        <Table.Root showColumnBorder size="sm" variant="outline">
          <Table.Body>
            <Table.Row>
              <Table.Cell fontWeight="medium">Distance/Angle</Table.Cell>

              {angles.map((angle) => (
                <Table.Cell key={angle} fontWeight="medium">
                  {angle}°
                </Table.Cell>
              ))}
            </Table.Row>

            {distances.map((distance) => (
              <Table.Row key={distance}>
                <Table.Cell fontWeight="medium">
                  <FormatNumber value={distance} /> meters
                </Table.Cell>

                {angles.map((angle) => {
                  let anglePen = penetration[angle][distance];

                  if (typeof anglePen !== 'undefined' && mode === 'rel')
                    anglePen = Math.round(relativePenetration(anglePen, angle));

                  return (
                    <Table.Cell key={angle}>{anglePen ?? '-'} mm</Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </BasicCard>
  );
}
