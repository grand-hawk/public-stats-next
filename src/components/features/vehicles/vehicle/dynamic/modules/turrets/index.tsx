import React from 'react';

import Turret from '@/components/features/vehicles/vehicle/dynamic/modules/turrets/turret';
import SectionMarker from '@/components/wiki/sectionMarker';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import {
  getAllModulesOfType,
  getOneModuleFromReferences,
} from '@/utils/alterations';

import type { VehicleModuleWithId } from '@/utils/vehicles';

export type TurretWithName = VehicleModuleWithId<'Turret'> & {
  name: string;
};

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

export default function Turrets() {
  const { assembledModules } = useDynamicData();

  const turrets = getAllModulesOfType('Turret', assembledModules);

  const turretsWithNames = React.useMemo(() => {
    return turrets.map((turret) => {
      let name = 'Turret';

      const control = getOneModuleFromReferences<'Seat'>(
        turret.data.control,
        assembledModules,
      );
      if (control) name = `${control.data.name} turret`;

      return {
        name,
        ...turret,
      };
    }) as TurretWithName[];
  }, [assembledModules, turrets]);

  const deduplicatedTurretsWithNames = React.useMemo(() => {
    const totalCounts: Record<string, number> = {};
    for (const turret of turretsWithNames)
      totalCounts[turret.name] = (totalCounts[turret.name] ?? 0) + 1;

    const occurrenceIndex: Record<string, number> = {};
    return turretsWithNames.map((turret) => {
      occurrenceIndex[turret.name] = (occurrenceIndex[turret.name] ?? 0) + 1;

      const numberedName =
        totalCounts[turret.name] > 1
          ? `${turret.name} ${occurrenceIndex[turret.name]}`
          : turret.name;

      return {
        ...turret,
        name: numberedName,
      };
    });
  }, [turretsWithNames]);

  const sortedTurrets = React.useMemo(() => {
    return deduplicatedTurretsWithNames.sort((a, b) => {
      const aPriority = getTurretPriorityIndex(a.name);
      const bPriority = getTurretPriorityIndex(b.name);

      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.name.localeCompare(b.name);
    });
  }, [deduplicatedTurretsWithNames]);

  if (sortedTurrets.length === 0) return null;
  return (
    <>
      <SectionMarker name="Turrets" anchor={sortedTurrets[0].name} />

      {sortedTurrets.map((turret) => (
        <Turret key={turret.name} turret={turret} />
      ))}
    </>
  );
}
