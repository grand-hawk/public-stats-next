import React from 'react';

import type { DetailedInfantryWeapon } from '@/server/api/trpc/routers/infantryWeapons';

export const InfantryWeaponContext =
  React.createContext<DetailedInfantryWeapon>({} as DetailedInfantryWeapon);

export function useInfantryWeapon() {
  return React.useContext(InfantryWeaponContext);
}
