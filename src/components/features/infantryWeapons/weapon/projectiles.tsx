import React from 'react';

import Projectiles from '@/components/features/shells/projectiles';
import { useInfantryWeapon } from '@/hooks/providers/infantryWeapon';

export default function InfantryWeaponProjectiles() {
  const weapon = useInfantryWeapon();

  return (
    <Projectiles projectiles={weapon.projectiles} weapon={weapon.name} />
  );
}
