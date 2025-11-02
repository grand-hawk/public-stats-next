import { SegmentGroup } from '@chakra-ui/react';
import React from 'react';

import type { KdrPlaceData } from '@generated/kdr';

export default function KdrRangeSelect({
  range,
  setRange,
}: {
  range: keyof KdrPlaceData;
  setRange: React.Dispatch<React.SetStateAction<keyof KdrPlaceData>>;
}) {
  const items = [
    {
      value: 'all_time',
      label: 'All time',
    },
    {
      value: 'recent',
      label: 'Recent',
    },
  ];

  return (
    <SegmentGroup.Root
      marginLeft="auto"
      size="sm"
      value={range}
      width="max-content"
      onValueChange={(details) =>
        setRange((details.value || 'all_time') as keyof KdrPlaceData)
      }
    >
      <SegmentGroup.Indicator />
      {items.map((item) => (
        <SegmentGroup.Item key={item.value} value={item.value}>
          <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
