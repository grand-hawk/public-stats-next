import React from 'react';

import { ContextCapturer } from '@/components/development/contextCapturer';
import ShellDamage from '@/components/shells/shell/damage';
import ShellHeader from '@/components/shells/shell/header';
import ShellMissile from '@/components/shells/shell/missile';
import ShellPenetrationTable from '@/components/shells/shell/penetrationTable';
import ShellProjectile from '@/components/shells/shell/projectile';
import ShellVehicles from '@/components/shells/shell/vehicles';
import { ShellContext } from '@/hooks/providers/shell';

import type { DetailedShell } from '@/server/api/trpc/routers/shells';

export default function Shell({ shell }: { shell: DetailedShell }) {
  return (
    <ShellContext.Provider value={shell}>
      <ContextCapturer contextKey="Shell" data={shell} />

      <ShellHeader />
      <ShellProjectile />
      <ShellDamage />
      <ShellMissile />
      <ShellPenetrationTable />
      <ShellVehicles />
    </ShellContext.Provider>
  );
}
