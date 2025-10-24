import React from 'react';

import Turret from '@/components/vehicles/vehicle/dynamic/modules/turrets/turret';
import { useDynamicData } from '@/hooks/contexts/dynamicData';
import {
  getAllModulesOfType,
  getOneModuleFromReferences,
} from '@/utils/alterations';
import { betterSentenceCase } from '@/utils/betterSentenceCase';

import type { VehicleModuleFromType } from '@/utils/vehicles';

export type TurretWithName = VehicleModuleFromType<'Turret'> & {
  name: string;
};

const TURRET_PRORITIES = [
  'Gunner turret',
  'Commander turret',
  'Loader turret',
  'Driver turret',
] as const;

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
      const baseName = betterSentenceCase(turret.name);
      occurrenceIndex[baseName] = (occurrenceIndex[baseName] ?? 0) + 1;

      const numberedName =
        totalCounts[baseName] > 1
          ? `${baseName} ${occurrenceIndex[baseName]}`
          : baseName;

      return {
        ...turret,
        name: numberedName,
      };
    });
  }, [turretsWithNames]);

  const sortedTurrets = React.useMemo(() => {
    const getPriorityIndex = (name: string) => {
      const index = TURRET_PRORITIES.findIndex((priorityName) =>
        name.startsWith(priorityName),
      );
      return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };

    return deduplicatedTurretsWithNames.sort((a, b) => {
      const aPriority = getPriorityIndex(a.name);
      const bPriority = getPriorityIndex(b.name);

      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.name.localeCompare(b.name);
    });
  }, [deduplicatedTurretsWithNames]);

  return sortedTurrets.map((turret) => (
    <Turret key={turret.name} turret={turret} />
  ));
}
