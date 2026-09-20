import NextLink from 'next/link';
import React from 'react';

import { ArticleTable } from '@/components/article/elements';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

import type { ApsSystem } from '@/server/utils/articles/aps';

type Range = [number, number];

interface Row extends ApsSystem {
  key: string;
  launcherRange: Range;
}

function mergeRows(
  systems: ApsSystem[],
  keyOf: (system: ApsSystem) => string,
): Row[] {
  const rows = new Map<string, Row>();

  for (const system of systems) {
    const key = keyOf(system);
    const existing = rows.get(key);

    if (existing) {
      existing.vehicles = [...existing.vehicles, ...system.vehicles];
      existing.launcherRange = [
        Math.min(existing.launcherRange[0], system.launchers),
        Math.max(existing.launcherRange[1], system.launchers),
      ];
    } else {
      rows.set(key, {
        ...system,
        key,
        launcherRange: [system.launchers, system.launchers],
      });
    }
  }

  return [...rows.values()];
}

function formatRange([low, high]: Range) {
  return low === high ? `${low}` : `${low} to ${high}`;
}

function VehicleLinks({ vehicles }: { vehicles: ApsSystem['vehicles'] }) {
  const place = usePlace()!;

  return (
    <>
      {vehicles.map((vehicle, index) => (
        <React.Fragment key={vehicle.slug}>
          {index > 0 && ', '}
          <NextLink
            href={`/${place.initials}/vehicles/${vehicle.slug}`}
            prefetch={false}
          >
            {vehicle.name}
          </NextLink>
        </React.Fragment>
      ))}
    </>
  );
}

export default function ApsTable({ kind }: { kind: 'stops' | 'coverage' }) {
  const place = usePlace()!;
  const [systems] = trpc.articles.aps.useSuspenseQuery({
    placeId: place.placeId,
  });

  if (kind === 'coverage') {
    const rows = mergeRows(
      systems,
      (system) =>
        `${system.label}|${system.horizontalWidth}|${system.vertical}`,
    );

    return (
      <ArticleTable>
        <thead>
          <tr>
            <th>System</th>
            <th>Launchers</th>
            <th>Each launcher covers</th>
            <th>Vehicles</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{row.label}</td>
              <td>{formatRange(row.launcherRange)}</td>
              <td>
                {row.horizontalWidth}° wide, {row.vertical[0]}° to{' '}
                {row.vertical[1]}° up
              </td>
              <td>
                <VehicleLinks vehicles={row.vehicles} />
              </td>
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    );
  }

  const rows = mergeRows(
    systems,
    (system) =>
      `${system.label}|${system.maxSpeed}|${system.resistance}|${system.drones}`,
  );

  return (
    <ArticleTable>
      <thead>
        <tr>
          <th>System</th>
          <th>Stops rounds up to</th>
          <th>Solid shot loses</th>
          <th>FPV drones</th>
          <th>Vehicles</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td>{row.label}</td>
            <td>{row.maxSpeed.toLocaleString('en')} m/s</td>
            <td>{Math.round(row.resistance * 100)}%</td>
            <td>{row.drones ? 'Targeted' : 'Ignored'}</td>
            <td>
              <VehicleLinks vehicles={row.vehicles} />
            </td>
          </tr>
        ))}
      </tbody>
    </ArticleTable>
  );
}
