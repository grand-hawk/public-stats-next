import { Box } from '@chakra-ui/react';
import React from 'react';

import FilterChip from '@/components/ui/filters/chip';
import FilterGroup from '@/components/ui/filters/group';

import type { FilterOption } from '@/components/ui/filters/options';

export interface FilterChipGroupProps<T extends string> {
  defaultOpen?: boolean;
  onClear: () => void;
  onToggle: (key: T) => void;
  options: readonly FilterOption<T>[];
  selected: ReadonlySet<string>;
  title: string;
}

const CHIP_ROW_CSS = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  margin: 0,
  padding: '8px',
  listStyle: 'none',
} as const;

export default function FilterChipGroup<T extends string>({
  defaultOpen,
  onClear,
  onToggle,
  options,
  selected,
  title,
}: FilterChipGroupProps<T>) {
  return (
    <FilterGroup
      defaultOpen={defaultOpen}
      hasActive={selected.size > 0}
      title={title}
      onClear={onClear}
    >
      <Box as="ul" css={CHIP_ROW_CSS}>
        {options.map((option) => (
          <FilterChip
            key={option.key}
            checked={selected.has(option.key)}
            count={option.count}
            onToggle={() => onToggle(option.key)}
          >
            {option.label}
          </FilterChip>
        ))}
      </Box>
    </FilterGroup>
  );
}
