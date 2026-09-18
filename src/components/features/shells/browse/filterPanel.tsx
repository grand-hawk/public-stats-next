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
  CALIBRE_BANDS,
  DAMAGE_BANDS,
  EXP_MASS_BANDS,
  MASS_BANDS,
  PEN_BANDS,
  VEL_BANDS,
} from '@/utils/filters/shellBands';
import { SHELL_TYPE_LABELS } from '@/utils/filters/shellTypes';

import type { ShellFilters } from '@/components/features/shells/browse/useShellFilters';
import type { LabelledKey } from '@/components/ui/filters/options';
import type {
  ShellPropertyKey,
  ShellSearchFacets,
} from '@/server/api/trpc/routers/shells';

export interface ShellFilterPanelProps {
  facets: ShellSearchFacets;
  filters: ShellFilters;
  pending: boolean;
  resultLabel: string;
}

const PROPERTY_CHIPS: LabelledKey<ShellPropertyKey>[] = [
  { key: 'laser', label: 'Laser' },
  { key: 'explosive', label: 'Explosive' },
  { key: 'guided', label: 'Guided' },
  { key: 'irccm', label: 'IRCCM' },
  { key: 'unjammable', label: 'Unjammable' },
];

export default function ShellFilterPanel({
  facets,
  filters,
  pending,
  resultLabel,
}: ShellFilterPanelProps) {
  return (
    <FilterPanel
      hasFilters={filters.hasFilters}
      pending={pending}
      query={filters.query}
      resultLabel={resultLabel}
      searchPlaceholder="Search shells"
      onClearAll={filters.clearAll}
      onQueryChange={filters.setQuery}
    >
      <FilterOptionGroup
        options={facetOptions(
          facets.types,
          (key) => SHELL_TYPE_LABELS.get(key) ?? key,
        )}
        selected={filters.types.selected}
        title="Shell type"
        onClear={filters.types.clear}
        onToggle={filters.types.toggle}
      />

      <FilterOptionGroup
        options={bandOptions(CALIBRE_BANDS, facets.calibres)}
        selected={filters.calibres.selected}
        title="Calibre (mm)"
        onClear={filters.calibres.clear}
        onToggle={filters.calibres.toggle}
      />

      <FilterOptionGroup
        options={bandOptions(PEN_BANDS, facets.penetration)}
        selected={filters.penetration.selected}
        title="Penetration (mm)"
        onClear={filters.penetration.clear}
        onToggle={filters.penetration.toggle}
      />

      <FilterOptionGroup
        defaultOpen={false}
        options={bandOptions(VEL_BANDS, facets.velocity)}
        selected={filters.velocity.selected}
        title="Velocity (m/s)"
        onClear={filters.velocity.clear}
        onToggle={filters.velocity.toggle}
      />

      <FilterOptionGroup
        defaultOpen={false}
        options={bandOptions(DAMAGE_BANDS, facets.damage)}
        selected={filters.damage.selected}
        title="Damage"
        onClear={filters.damage.clear}
        onToggle={filters.damage.toggle}
      />

      <FilterOptionGroup
        defaultOpen={false}
        options={bandOptions(MASS_BANDS, facets.mass)}
        selected={filters.mass.selected}
        title="Mass (kg)"
        onClear={filters.mass.clear}
        onToggle={filters.mass.toggle}
      />

      <FilterOptionGroup
        defaultOpen={false}
        options={bandOptions(EXP_MASS_BANDS, facets.explosiveMass)}
        selected={filters.explosiveMass.selected}
        title="Explosive mass (kg)"
        onClear={filters.explosiveMass.clear}
        onToggle={filters.explosiveMass.toggle}
      />

      <FilterChipGroup
        defaultOpen={false}
        options={countedOptions(PROPERTY_CHIPS, facets.properties)}
        selected={filters.properties.selected}
        title="Properties"
        onClear={filters.properties.clear}
        onToggle={filters.properties.toggle}
      />
    </FilterPanel>
  );
}
