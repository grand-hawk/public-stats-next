import React from 'react';

import FilterCheckbox from '@/components/ui/filters/checkbox';
import FilterGroup from '@/components/ui/filters/group';

import type { FilterOption } from '@/components/ui/filters/options';

export interface FilterOptionGroupProps<T extends string> {
  defaultOpen?: boolean;
  onClear: () => void;
  onToggle: (key: T) => void;
  options: readonly FilterOption<T>[];
  selected: ReadonlySet<string>;
  title: string;
}

export default function FilterOptionGroup<T extends string>({
  defaultOpen,
  onClear,
  onToggle,
  options,
  selected,
  title,
}: FilterOptionGroupProps<T>) {
  return (
    <FilterGroup
      defaultOpen={defaultOpen}
      hasActive={selected.size > 0}
      title={title}
      onClear={onClear}
    >
      {options.map((option) => (
        <FilterCheckbox
          key={option.key}
          checked={selected.has(option.key)}
          count={option.count}
          label={option.label}
          onToggle={() => onToggle(option.key)}
        />
      ))}
    </FilterGroup>
  );
}
