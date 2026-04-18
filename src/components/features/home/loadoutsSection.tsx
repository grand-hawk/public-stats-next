import { Flex } from '@chakra-ui/react';
import React from 'react';

import LoadoutSmall from '@/components/features/home/loadoutSmall';

export default function LoadoutsSection({
  initials,
  loadouts,
}: {
  initials: string;
  loadouts: {
    description: string;
    name: string;
    slug: string;
    thumbnail: string;
  }[];
}) {
  return (
    <Flex gap={2} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
      {loadouts.map((loadout) => (
        <LoadoutSmall
          key={loadout.slug}
          description={loadout.description}
          href={`/${initials}/loadouts/${loadout.slug}`}
          name={loadout.name}
          thumbnail={loadout.thumbnail}
        />
      ))}
    </Flex>
  );
}
