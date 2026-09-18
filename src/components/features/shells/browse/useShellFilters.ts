import React from 'react';

import { useToggleSet } from '@/components/ui/filters/useToggleSet';
import { usePlace } from '@/hooks/usePlace';
import { sortedArray } from '@/utils/sortedSet';

import type { ShellPropertyKey } from '@/server/api/trpc/routers/shells';
import type {
  CalibreBand,
  DamageBand,
  ExpMassBand,
  MassBand,
  PenBand,
  VelBand,
} from '@/utils/filters/shellBands';

export type ShellFilters = ReturnType<typeof useShellFilters>;

export function useShellFilters() {
  const place = usePlace()!;

  const [query, setQuery] = React.useState('');
  const deferredQuery = React.useDeferredValue(query);

  const mass = useToggleSet<MassBand>();
  const explosiveMass = useToggleSet<ExpMassBand>();
  const damage = useToggleSet<DamageBand>();
  const penetration = useToggleSet<PenBand>();
  const velocity = useToggleSet<VelBand>();
  const types = useToggleSet<string>();
  const calibres = useToggleSet<CalibreBand>();
  const properties = useToggleSet<ShellPropertyKey>();

  const searchInput = React.useMemo(
    () => ({
      calibres: sortedArray(calibres.selected),
      damage: sortedArray(damage.selected),
      explosive: properties.selected.has('explosive'),
      explosiveMass: sortedArray(explosiveMass.selected),
      guided: properties.selected.has('guided'),
      irccm: properties.selected.has('irccm'),
      laser: properties.selected.has('laser'),
      mass: sortedArray(mass.selected),
      penetration: sortedArray(penetration.selected),
      placeId: place.placeId,
      query: deferredQuery,
      types: sortedArray(types.selected),
      unjammable: properties.selected.has('unjammable'),
      velocity: sortedArray(velocity.selected),
    }),
    [
      calibres.selected,
      damage.selected,
      deferredQuery,
      explosiveMass.selected,
      mass.selected,
      penetration.selected,
      place.placeId,
      properties.selected,
      types.selected,
      velocity.selected,
    ],
  );

  const groups = [
    mass,
    explosiveMass,
    damage,
    penetration,
    velocity,
    types,
    calibres,
    properties,
  ];

  const activeCount = groups.reduce(
    (total, group) => total + group.selected.size,
    0,
  );

  return {
    activeCount,
    calibres,
    clearAll: () => {
      for (const group of groups) group.clear();
      setQuery('');
    },
    damage,
    explosiveMass,
    hasFilters: activeCount > 0 || !!query,
    mass,
    penetration,
    properties,
    query,
    searchInput,
    setQuery,
    types,
    velocity,
  };
}
