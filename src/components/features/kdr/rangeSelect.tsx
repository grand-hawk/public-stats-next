import React from 'react';

import { Pill, PillGroup } from '@/components/ui/pillGroup';

import type { KdrPlaceData } from '@generated/kdr';

export const KDR_RANGE_ITEMS = [
  {
    value: 'all_time',
    label: 'All time',
  },
  {
    value: 'recent',
    label: 'Recent',
  },
];

export default function KdrRangeSelect({
  range,
  setRange,
}: {
  range: keyof KdrPlaceData;
  setRange: (value: string | null) => void;
}) {
  return (
    <PillGroup label="K/D time range">
      {KDR_RANGE_ITEMS.map((item) => (
        <Pill
          key={item.value}
          selected={item.value === range}
          onClick={() => setRange(item.value)}
        >
          {item.label}
        </Pill>
      ))}
    </PillGroup>
  );
}
