import NextLink from 'next/link';
import React from 'react';

import { ArticleTable } from '@/components/article/elements';
import { ShellList } from '@/components/article/shellQuery';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

import type {
  EraPanelVehicle,
  Range,
} from '@/server/utils/articles/eraPanels';

const MANY_VEHICLES = 20;

function formatRange([low, high]: Range, unit: string) {
  return low === high ? `${low}${unit}` : `${low} to ${high}${unit}`;
}

function formatResistance([low, high]: Range) {
  const percent: Range = [Math.round(low * 100), Math.round(high * 100)];
  if (percent[1] === 0) return 'None';
  return percent[0] === percent[1]
    ? `${percent[0]}%`
    : `${percent[0]}% to ${percent[1]}%`;
}

function VehicleLinks({
  initials,
  vehicles,
}: {
  initials: string;
  vehicles: EraPanelVehicle[];
}) {
  return (
    <>
      {vehicles.map((vehicle, index) => (
        <React.Fragment key={vehicle.slug}>
          {index > 0 && ', '}
          <NextLink
            href={`/${initials}/vehicles/${vehicle.slug}`}
            prefetch={false}
          >
            {vehicle.name}
          </NextLink>
        </React.Fragment>
      ))}
    </>
  );
}

function spread(values: number[]): Range {
  return [Math.min(...values), Math.max(...values)];
}

function removedShare(tip: number, antiTandem: number) {
  return Math.min(Math.max(tip * (1 - antiTandem ** 2), 0), 1);
}

export default function EraPanelTable({
  kind,
}: {
  kind: 'named' | 'vehicle' | 'tandem' | 'antiEra' | 'eraTipRounds';
}) {
  const place = usePlace()!;
  const [panels] = trpc.articles.eraPanels.useSuspenseQuery({
    placeId: place.placeId,
  });

  if (kind === 'eraTipRounds') {
    return (
      <ArticleTable>
        <thead>
          <tr>
            <th>ERA tip</th>
            <th>Rounds</th>
          </tr>
        </thead>
        <tbody>
          {panels.eraTips.map((tip) => (
            <tr key={tip}>
              <td>{tip}</td>
              <td>
                <ShellList eraTip={tip} />
              </td>
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    );
  }

  if (kind === 'tandem') {
    const rows = panels.named
      .map((panel) => ({
        label: panel.label,
        heat: spread(panel.variants.map(({ heat, ke }) => ke + heat)),
        tandem: spread(
          panel.variants.map(({ antiTandem, heat, ke }) =>
            Math.round(ke + heat * antiTandem),
          ),
        ),
        kept: panel.antiTandem,
      }))
      .sort((a, b) => a.kept[1] - b.kept[1] || a.heat[1] - b.heat[1]);

    return (
      <ArticleTable>
        <thead>
          <tr>
            <th>Panel</th>
            <th>Against ordinary HEAT</th>
            <th>Against a tandem warhead</th>
            <th>HEAT protection kept</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{formatRange(row.heat, ' mm')}</td>
              <td>{formatRange(row.tandem, ' mm')}</td>
              <td>{formatResistance(row.kept)}</td>
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    );
  }

  if (kind === 'antiEra') {
    const rows = [...panels.named].sort(
      (a, b) => a.antiTandem[1] - b.antiTandem[1] || a.ke[1] - b.ke[1],
    );

    return (
      <ArticleTable>
        <thead>
          <tr>
            <th>Panel</th>
            {panels.eraTips.map((tip) => (
              <th key={tip}>{tip}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((panel) => (
            <tr key={panel.label}>
              <td>{panel.label}</td>
              {panels.eraTips.map((tip) => (
                <td key={tip}>
                  {formatResistance(
                    spread(
                      panel.variants.map(({ antiTandem }) =>
                        removedShare(tip, antiTandem),
                      ),
                    ),
                  ).replace('None', '0%')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    );
  }

  if (kind === 'named') {
    return (
      <ArticleTable>
        <thead>
          <tr>
            <th>Panel</th>
            <th>Against solid shot</th>
            <th>Against HEAT</th>
            <th>Against tandem</th>
            <th>Vehicles</th>
          </tr>
        </thead>
        <tbody>
          {panels.named.map((panel) => (
            <tr key={panel.label}>
              <td>{panel.label}</td>
              <td>{formatRange(panel.ke, ' mm')}</td>
              <td>{formatRange(panel.heat, ' mm')}</td>
              <td>{formatResistance(panel.antiTandem)}</td>
              <td>
                {panel.vehicles.length > MANY_VEHICLES ? (
                  `${panel.vehicles.length} vehicles`
                ) : (
                  <VehicleLinks
                    initials={place.initials}
                    vehicles={panel.vehicles}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    );
  }

  return (
    <ArticleTable>
      <thead>
        <tr>
          <th>Vehicle and panel</th>
          <th>Against solid shot</th>
          <th>Against HEAT</th>
          <th>Against tandem</th>
        </tr>
      </thead>
      <tbody>
        {panels.specific.map((panel) => (
          <tr key={`${panel.ke}/${panel.heat}/${panel.antiTandem}`}>
            <td>
              <VehicleLinks
                initials={place.initials}
                vehicles={panel.vehicles}
              />
              , {panel.suffix}
            </td>
            <td>{panel.ke} mm</td>
            <td>{panel.heat} mm</td>
            <td>{formatResistance([panel.antiTandem, panel.antiTandem])}</td>
          </tr>
        ))}
      </tbody>
    </ArticleTable>
  );
}
