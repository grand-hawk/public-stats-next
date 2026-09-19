import { Box, Tabs } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import React from 'react';
import slug from 'slug';

import ShellDamage from '@/components/features/shells/shell/damage';
import ShellMissile from '@/components/features/shells/shell/missile';
import ShellPenetrationTable from '@/components/features/shells/shell/penetrationTable';
import ShellProjectile from '@/components/features/shells/shell/projectile';
import {
  TABS_ROOT_CSS,
  WikiTabTrigger,
  WikiTabsList,
} from '@/components/wiki/tabs';
import { useInfantryWeapon } from '@/hooks/providers/infantryWeapon';
import { ShellContext } from '@/hooks/providers/shell';

import type { DetailedShell } from '@/server/api/trpc/routers/shells';

export default function InfantryWeaponProjectiles() {
  const weapon = useInfantryWeapon();
  const [mode, setMode] = useQueryState('mode');

  const shells = React.useMemo(
    () =>
      weapon.projectiles.map((projectile): DetailedShell => ({
        ...projectile,
        linkedData: {},
        slug: slug(projectile.name),
        vehicles: [],
        weapon: weapon.name,
      })),
    [weapon],
  );

  if (shells.length === 0) return null;

  const selected = shells.find((shell) => shell.slug === mode) ?? shells[0];

  return (
    <>
      {shells.length > 1 && (
        <Box data-md-ignore marginBlockStart="24px">
          <Tabs.Root
            css={TABS_ROOT_CSS}
            variant="plain"
            onValueChange={(event) => setMode(event.value)}
            value={selected.slug}
          >
            <WikiTabsList>
              {shells.map((shell) => (
                <WikiTabTrigger key={shell.slug} value={shell.slug}>
                  {shell.name}
                </WikiTabTrigger>
              ))}
            </WikiTabsList>
          </Tabs.Root>
        </Box>
      )}

      <ShellContext.Provider value={selected}>
        <ShellProjectile />
        <ShellDamage />
        <ShellMissile />
        <ShellPenetrationTable />
      </ShellContext.Provider>

      {shells.length > 1 && (
        <div data-md-show style={{ display: 'none' }}>
          <h2>Firing modes</h2>
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th>Type</th>
                <th>Max penetration</th>
                <th>Velocity</th>
              </tr>
            </thead>
            <tbody>
              {shells.map((shell) => (
                <tr key={shell.slug}>
                  <td>{shell.name}</td>
                  <td>{shell.type}</td>
                  <td>{shell.maxPenetration} mm</td>
                  <td>{shell.velocity} m/s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
