import React from 'react';

import { ContextCapturer } from '@/components/development/contextCapturer';
import ShellDamage from '@/components/features/shells/shell/damage';
import ShellHeader from '@/components/features/shells/shell/header';
import ShellMissile from '@/components/features/shells/shell/missile';
import ShellPenetrationTable from '@/components/features/shells/shell/penetrationTable';
import ShellProjectile from '@/components/features/shells/shell/projectile';
import ShellVehicles from '@/components/features/shells/shell/vehicles';
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
