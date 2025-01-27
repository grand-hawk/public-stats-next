import { FormatNumber, Table } from '@chakra-ui/react';
import React from 'react';

import type { Shell } from '@/server/api/trpc/routers/shells';

export default function PenetrationTable({
  penetration,
}: {
  penetration: NonNullable<Shell['penetrationTable']>;
}) {
  const angles = Object.keys(penetration).map((angle) => Number(angle));
  angles.sort((a, b) => a - b);

  const distances = Object.keys(penetration[angles[0]]).map((distance) =>
    Number(distance),
  );
  distances.sort((a, b) => a - b);

  return (
    <Table.ScrollArea height="100%" width="100%">
      <Table.Root showColumnBorder size="sm" variant="outline">
        <Table.Body>
          <Table.Row>
            <Table.Cell />

            {angles.map((angle) => (
              <Table.Cell key={angle}>{angle}°</Table.Cell>
            ))}
          </Table.Row>

          {distances.map((distance) => (
            <Table.Row key={distance}>
              <Table.Cell>
                <FormatNumber value={distance} /> meters
              </Table.Cell>

              {angles.map((angle) => {
                const anglePen = penetration[angle][distance];

                return (
                  <Table.Cell key={angle}>{anglePen ?? '-'} mm</Table.Cell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
