import { Flex } from '@chakra-ui/react';
import React from 'react';

import ClassStrip from '@/components/features/home/classStrip';

import type { VehicleClassCategory } from '@/components/features/vehicles/classCategories';

export default function ClassesSection({
  classCounts,
  classes,
  initials,
}: {
  classes: VehicleClassCategory[];
  classCounts: Record<string, number>;
  initials: string;
}) {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap={2}
      height={{ base: 'auto', md: '340px' }}
    >
      {classes.map((category) => (
        <ClassStrip
          key={category.slug}
          accent={category.accent}
          count={classCounts[category.name] ?? 0}
          href={`/${initials}/vehicles/class/${category.slug}`}
          icon={category.fallbackIcon}
          image={category.image}
          label={category.label}
        />
      ))}
    </Flex>
  );
}
