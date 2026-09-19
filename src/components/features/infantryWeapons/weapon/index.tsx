import React from 'react';

import { ContextCapturer } from '@/components/development/contextCapturer';
import InfantryWeaponDescription from '@/components/features/infantryWeapons/weapon/about';
import InfantryWeaponAvailabilityTable from '@/components/features/infantryWeapons/weapon/availability';
import InfantryWeaponHandling from '@/components/features/infantryWeapons/weapon/handling';
import InfantryWeaponHeader from '@/components/features/infantryWeapons/weapon/header';
import InfantryWeaponProjectiles from '@/components/features/infantryWeapons/weapon/projectiles';
import { InfantryWeaponContext } from '@/hooks/providers/infantryWeapon';

import type { DetailedInfantryWeapon } from '@/server/api/trpc/routers/infantryWeapons';

export default function InfantryWeapon({
  weapon,
}: {
  weapon: DetailedInfantryWeapon;
}) {
  return (
    <InfantryWeaponContext.Provider value={weapon}>
      <ContextCapturer contextKey="InfantryWeapon" data={weapon} />

      <InfantryWeaponHeader />
      <InfantryWeaponDescription />
      <InfantryWeaponAvailabilityTable />
      <InfantryWeaponHandling />
      <InfantryWeaponProjectiles />
    </InfantryWeaponContext.Provider>
  );
}
