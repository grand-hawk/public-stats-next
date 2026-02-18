import {
  getAllModulesOfType,
  getOneModuleFromReferences,
} from '@/utils/alterations';

import type { VehicleModuleWithId } from '@/utils/vehicles';

export const TURRET_PRIORITIES = [
  'Gunner turret',
  'Commander turret',
  'Loader turret',
  'Driver turret',
] as const;

export function getTurretPriorityIndex(name: string) {
  const index = TURRET_PRIORITIES.findIndex((priorityName) =>
    name.startsWith(priorityName),
  );
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export type TurretWithName = VehicleModuleWithId<'Turret'> & { name: string };

export function getTurretsWithNamesSorted(
  modules: Parameters<typeof getAllModulesOfType>[1],
): TurretWithName[] {
  const turrets = getAllModulesOfType('Turret', modules);

  const withNames = turrets.map((turret) => {
    let name = 'Turret';
    const control = getOneModuleFromReferences<'Seat'>(
      turret.data.control,
      modules,
    );
    if (control) name = `${control.data.name} turret`;
    return { ...turret, name } as TurretWithName;
  });

  withNames.sort((a, b) => {
    const aPriority = getTurretPriorityIndex(a.name);
    const bPriority = getTurretPriorityIndex(b.name);
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.name.localeCompare(b.name);
  });

  return withNames;
}
