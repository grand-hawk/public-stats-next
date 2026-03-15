import React from 'react';

import Turret from '@/components/features/vehicles/vehicle/dynamic/modules/turrets/turret';
import SectionMarker from '@/components/wiki/sectionMarker';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getTurretsWithNamesSorted } from '@/utils/turrets';

import type { TurretWithName } from '@/utils/turrets';

export type { TurretWithName };

export default function Turrets() {
  const { assembledModules } = useDynamicData();

  const turretsWithNames = React.useMemo(
    () => getTurretsWithNamesSorted(assembledModules),
    [assembledModules],
  );

  const sortedTurrets = React.useMemo(() => {
    const totalCounts: Record<string, number> = {};
    for (const turret of turretsWithNames) {
      totalCounts[turret.name] = (totalCounts[turret.name] ?? 0) + 1;
    }

    const occurrenceIndex: Record<string, number> = {};
    return turretsWithNames.map((turret) => {
      occurrenceIndex[turret.name] = (occurrenceIndex[turret.name] ?? 0) + 1;

      const numberedName =
        totalCounts[turret.name] > 1
          ? `${turret.name} ${occurrenceIndex[turret.name]}`
          : turret.name;

      return { ...turret, name: numberedName };
    });
  }, [turretsWithNames]);

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
