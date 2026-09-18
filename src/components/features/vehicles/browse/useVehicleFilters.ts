import React from 'react';

import { useToggleSet } from '@/components/ui/filters/useToggleSet';
import { usePlace } from '@/hooks/usePlace';
import { sortedArray } from '@/utils/sortedSet';

import type { VehicleFeatureKey } from '@/server/api/trpc/routers/vehicles';
import type {
  CrewBand,
  PowerBand,
  SpeedBand,
  WeightBand,
} from '@/utils/filters/vehicleBands';

export type VehicleFilters = ReturnType<typeof useVehicleFilters>;

export function useVehicleFilters(defaultClassifications?: string[]) {
  const place = usePlace()!;

  const [query, setQuery] = React.useState('');

  const classifications = useToggleSet<string>(defaultClassifications);
  const speedBands = useToggleSet<SpeedBand>();
  const obtainments = useToggleSet<string>();
  const crewClasses = useToggleSet<string>();
  const eras = useToggleSet<string>();
  const teams = useToggleSet<string>();
  const weightBands = useToggleSet<WeightBand>();
  const powerBands = useToggleSet<PowerBand>();
  const crewBands = useToggleSet<CrewBand>();
  const locomotions = useToggleSet<string>();
  const features = useToggleSet<VehicleFeatureKey>();

  const searchInput = React.useMemo(
    () => ({
      amphibious: features.selected.has('amphibious'),
      aps: features.selected.has('aps'),
      classifications: sortedArray(classifications.selected),
      crewBands: sortedArray(crewBands.selected),
      crewClasses: sortedArray(crewClasses.selected),
      eras: sortedArray(eras.selected),
      ess: features.selected.has('ess'),
      fcs: features.selected.has('fcs'),
      jammer: features.selected.has('jammer'),
      locomotions: sortedArray(locomotions.selected),
      lws: features.selected.has('lws'),
      maws: features.selected.has('maws'),
      obtainments: sortedArray(obtainments.selected),
      placeId: place.placeId,
      powerBands: sortedArray(powerBands.selected),
      query,
      speedBands: sortedArray(speedBands.selected),
      stabilizer: features.selected.has('stabilizer'),
      teams: sortedArray(teams.selected),
      thermal: features.selected.has('thermal'),
      weightBands: sortedArray(weightBands.selected),
    }),
    [
      classifications.selected,
      crewBands.selected,
      crewClasses.selected,
      eras.selected,
      features.selected,
      locomotions.selected,
      obtainments.selected,
      place.placeId,
      powerBands.selected,
      query,
      speedBands.selected,
      teams.selected,
      weightBands.selected,
    ],
  );

  const groups = [
    classifications,
    speedBands,
    obtainments,
    crewClasses,
    eras,
    teams,
    weightBands,
    powerBands,
    crewBands,
    locomotions,
    features,
  ];

  const activeCount = groups.reduce(
    (total, group) => total + group.selected.size,
    0,
  );

  return {
    activeCount,
    classifications,
    clearAll: () => {
      for (const group of groups) group.clear();
      setQuery('');
    },
    crewBands,
    crewClasses,
    eras,
    features,
    hasFilters: activeCount > 0 || !!query,
    locomotions,
    obtainments,
    powerBands,
    query,
    searchInput,
    setQuery,
    speedBands,
    teams,
    weightBands,
  };
}
