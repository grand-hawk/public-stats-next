import { Group } from '@chakra-ui/react';
import React from 'react';

import LoadoutFilter from '@/components/winrate/filters/loadout';
import MapFilter from '@/components/winrate/filters/map';

import type { GroupProps } from '@chakra-ui/react';

export default function Filters({ ...props }: GroupProps) {
  return (
    <Group {...props}>
      <LoadoutFilter />
      <MapFilter />
    </Group>
  );
}
