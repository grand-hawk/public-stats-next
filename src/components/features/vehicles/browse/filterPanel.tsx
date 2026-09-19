import React from 'react';

import FilterChipGroup from '@/components/ui/filters/chipGroup';
import FilterOptionGroup from '@/components/ui/filters/optionGroup';
import {
  bandOptions,
  countedOptions,
  facetOptions,
} from '@/components/ui/filters/options';
import FilterPanel from '@/components/ui/filters/panel';
import {
  CREW_BANDS,
  POWER_BANDS,
  SPEED_BANDS,
  WEIGHT_BANDS,
} from '@/utils/filters/vehicleBands';
import { obtainmentLabel } from '@/utils/obtainment';

import type { VehicleFilters } from '@/components/features/vehicles/browse/useVehicleFilters';
import type { LabelledKey } from '@/components/ui/filters/options';
import type {
  VehicleFeatureKey,
  VehicleSearchFacets,
} from '@/server/api/trpc/routers/vehicles';

export interface VehicleFilterPanelProps {
  facets: VehicleSearchFacets;
  filters: VehicleFilters;
  pending: boolean;
  resultLabel: string;
}

const LOCOMOTION_LABELS: Record<string, string> = {
  aerial: 'Aerial',
  tracked: 'Tracked',
  wheeled: 'Wheeled',
};

const FEATURE_CHIPS: LabelledKey<VehicleFeatureKey>[] = [
  { key: 'aps', label: 'APS' },
  { key: 'thermal', label: 'Thermal' },
  { key: 'stabilizer', label: 'Stabilizer' },
  { key: 'amphibious', label: 'Amphibious' },
  { key: 'ess', label: 'ESS' },
  { key: 'jammer', label: 'Jammer' },
  { key: 'fcs', label: 'FCS' },
  { key: 'lws', label: 'LWS' },
  { key: 'maws', label: 'MAWS' },
];

export default function VehicleFilterPanel({
  facets,
  filters,
  pending,
  resultLabel,
}: VehicleFilterPanelProps) {
  return (
    <FilterPanel
      hasFilters={filters.hasFilters}
      pending={pending}
      query={filters.query}
      resultLabel={resultLabel}
      searchPlaceholder="Search vehicles"
      onClearAll={filters.clearAll}
      onQueryChange={filters.setQuery}
    >
      <FilterOptionGroup
        options={facetOptions(facets.classifications)}
        selected={filters.classifications.selected}
        title="Class"
        onClear={filters.classifications.clear}
        onToggle={filters.classifications.toggle}
      />

      <FilterOptionGroup
        options={bandOptions(SPEED_BANDS, facets.speedBands)}
        selected={filters.speedBands.selected}
        title="Speed (km/h)"
        onClear={filters.speedBands.clear}
        onToggle={filters.speedBands.toggle}
      />

      {facets.eras.length > 1 && (
        <FilterOptionGroup
          options={facetOptions(facets.eras)}
          selected={filters.eras.selected}
          title="Era"
          onClear={filters.eras.clear}
          onToggle={filters.eras.toggle}
        />
      )}

      {facets.teams.length > 1 && (
        <FilterOptionGroup
          defaultOpen={false}
          options={facetOptions(facets.teams)}
          selected={filters.teams.selected}
          title="Team"
          onClear={filters.teams.clear}
          onToggle={filters.teams.toggle}
        />
      )}

      <FilterOptionGroup
        defaultOpen={false}
        options={bandOptions(WEIGHT_BANDS, facets.weightBands)}
        selected={filters.weightBands.selected}
        title="Weight (t)"
        onClear={filters.weightBands.clear}
        onToggle={filters.weightBands.toggle}
      />

      <FilterOptionGroup
        defaultOpen={false}
        options={bandOptions(POWER_BANDS, facets.powerBands)}
        selected={filters.powerBands.selected}
        title="Power to weight (hp/t)"
        onClear={filters.powerBands.clear}
        onToggle={filters.powerBands.toggle}
      />

      <FilterOptionGroup
        defaultOpen={false}
        options={bandOptions(CREW_BANDS, facets.crewBands)}
        selected={filters.crewBands.selected}
        title="Crew seats"
        onClear={filters.crewBands.clear}
        onToggle={filters.crewBands.toggle}
      />

      {facets.locomotions.length > 1 && (
        <FilterOptionGroup
          defaultOpen={false}
          options={facetOptions(
            facets.locomotions,
            (key) => LOCOMOTION_LABELS[key] ?? key,
          )}
          selected={filters.locomotions.selected}
          title="Locomotion"
          onClear={filters.locomotions.clear}
          onToggle={filters.locomotions.toggle}
        />
      )}

      {facets.crewClasses.length > 0 && (
        <FilterOptionGroup
          defaultOpen={false}
          options={facetOptions(facets.crewClasses)}
          selected={filters.crewClasses.selected}
          title="Crew class"
          onClear={filters.crewClasses.clear}
          onToggle={filters.crewClasses.toggle}
        />
      )}

      <FilterChipGroup
        defaultOpen={false}
        options={countedOptions(FEATURE_CHIPS, facets.features)}
        selected={filters.features.selected}
        title="Features"
        onClear={filters.features.clear}
        onToggle={filters.features.toggle}
      />

      {facets.obtainments.length > 1 && (
        <FilterOptionGroup
          defaultOpen={false}
          options={facetOptions(facets.obtainments, obtainmentLabel)}
          selected={filters.obtainments.selected}
          title="Obtainment"
          onClear={filters.obtainments.clear}
          onToggle={filters.obtainments.toggle}
        />
      )}
    </FilterPanel>
  );
}
