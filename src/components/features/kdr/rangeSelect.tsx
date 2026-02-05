import { SegmentGroup } from '@chakra-ui/react';
import React from 'react';

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
    <SegmentGroup.Root
      marginLeft="auto"
      size="sm"
      value={range}
      width="max-content"
      onValueChange={(details) => setRange(details.value)}
    >
      <SegmentGroup.Indicator />

      {KDR_RANGE_ITEMS.map((item) => (
        <SegmentGroup.Item key={item.value} value={item.value}>
          <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
