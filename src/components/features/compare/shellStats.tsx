import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import { relPenetration } from '@/utils/penetration';
import { getFirstLosPenetrationAtAngle } from '@/utils/shellPenetration';

import type { SectionDef, StatDef } from '@/components/features/compare/types';
import type { DetailedShell } from '@/server/api/trpc/routers/shells';

function stat(
  label: string,
  getter: (s: DetailedShell) => React.ReactNode,
): StatDef<DetailedShell> {
  return { label, getter };
}

export function buildShellSections(
  shells: DetailedShell[],
): SectionDef<DetailedShell>[] {
  const hasEraTip = shells.some((s) => s.eraTip);
  const damageStats = [
    stat('Max damage', (s) => (
      <>
        <FormatNumber value={s.damage} /> HP
      </>
    )),
    stat('Humanoid damage', (s) => (
      <>
        <FormatNumber value={s.humanoidDamage} /> HP
      </>
    )),
    stat('Explosive mass', (s) =>
      s.explosive ? (
        <FormatNumber style="unit" unit="kilogram" value={s.explosive.mass} />
      ) : (
        '—'
      ),
    ),
    stat('Explosion radius', (s) =>
      s.explosive?.radius ? (
        <FormatNumber
          maximumFractionDigits={3}
          style="unit"
          unit="meter"
          value={s.explosive.radius}
        />
      ) : (
        '—'
      ),
    ),
    stat('Kill radius', (s) =>
      s.explosive?.killRadius ? (
        <FormatNumber
          style="unit"
          unit="meter"
          value={s.explosive.killRadius}
        />
      ) : (
        '—'
      ),
    ),
    stat('Submunitions', (s) =>
      s.cluster ? <FormatNumber value={s.cluster.submunitions} /> : '—',
    ),
    stat('Shrapnel multiplier', (s) =>
      s.shrapMultiplier ? (
        <>
          <FormatNumber value={s.shrapMultiplier} />x
        </>
      ) : (
        '—'
      ),
    ),
  ];

  return [
    {
      title: 'General',
      stats: [
        stat('Weapon', (s) => s.weapon),
        stat('Type', (s) => s.displayType),
      ],
    },
    {
      title: 'Projectile',
      stats: [
        stat('Mass', (s) => (
          <FormatNumber style="unit" unit="kilogram" value={s.mass} />
        )),
        stat('Velocity', (s) => (
          <FormatNumber
            style="unit"
            unit="meter-per-second"
            value={s.velocity}
          />
        )),
        stat('Max penetration', (s) => (
          <FormatNumber
            style="unit"
            unit="millimeter"
            value={
              getFirstLosPenetrationAtAngle(s.penetrationTable, 0) ??
              s.maxPenetration
            }
          />
        )),
        stat('30° penetration', (s) => (
          <FormatNumber
            style="unit"
            unit="millimeter"
            value={Math.round(
              relPenetration(
                getFirstLosPenetrationAtAngle(s.penetrationTable, 30) ??
                  s.maxPenetration,
                30,
              ),
            )}
          />
        )),
        stat('60° penetration', (s) => (
          <FormatNumber
            style="unit"
            unit="millimeter"
            value={Math.round(
              relPenetration(
                getFirstLosPenetrationAtAngle(s.penetrationTable, 60) ??
                  s.maxPenetration,
                60,
              ),
            )}
          />
        )),
        stat('Projectile diameter', (s) =>
          s.projectileDiameter ? (
            <FormatNumber
              style="unit"
              unit="millimeter"
              value={s.projectileDiameter}
            />
          ) : (
            '—'
          ),
        ),
        stat('Penetrator diameter', (s) =>
          s.penetratorDiameter ? (
            <FormatNumber
              style="unit"
              unit="millimeter"
              value={s.penetratorDiameter}
            />
          ) : (
            '—'
          ),
        ),
        stat('Ricochet angle', (s) =>
          s.ricochetAngle ? (
            <FormatNumber
              style="unit"
              unit="degree"
              unitDisplay="narrow"
              value={s.ricochetAngle}
            />
          ) : (
            '—'
          ),
        ),
        ...(hasEraTip
          ? [
              stat('ERA tip', (s) =>
                s.eraTip ? <FormatNumber value={s.eraTip} /> : '—',
              ),
            ]
          : []),
      ],
    },
    {
      title: 'Damage',
      stats: damageStats,
    },
    {
      title: 'Missile',
      stats: [
        stat('Boost time', (s) =>
          s.missile?.boostTime ? (
            <FormatNumber
              style="unit"
              unit="second"
              unitDisplay="narrow"
              value={s.missile.boostTime}
            />
          ) : (
            '—'
          ),
        ),
        stat('IRCCM', (s) => (s.missile?.irccm ? 'Yes' : '—')),
        stat('G limit', (s) =>
          s.missile?.limit !== undefined ? (
            <>
              <FormatNumber value={s.missile.limit} />G
            </>
          ) : (
            '—'
          ),
        ),
        stat('Turn rate', (s) =>
          s.missile?.turnRate !== undefined ? (
            <FormatNumber
              style="unit"
              unit="degree-per-second"
              unitDisplay="narrow"
              value={s.missile.turnRate}
            />
          ) : (
            '—'
          ),
        ),
        stat('Unjammable', (s) => (s.missile?.unjammable ? 'Yes' : '—')),
        stat('Laser guidance', (s) => (s.laser ? 'Yes' : '—')),
      ],
    },
  ];
}
