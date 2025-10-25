import { Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import slug from 'slug';

import { Button } from '@/components/ui/button';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useShell } from '@/hooks/providers/shell';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

export default function ShellVehicles() {
  const initials = usePlaceInitials()!;
  const shell = useShell();

  if (shell.vehicles.length === 0) return null;
  return (
    <TitledCard
      as="section"
      innerPadding={4}
      title="Vehicles with this shell"
      withAnchor="vehicles"
    >
      <Flex flexWrap="wrap" gap={2}>
        {shell.vehicles.map((vehicle) => {
          const vehicleSlug = slug(vehicle);

          return (
            <Button key={vehicle} asChild borderRadius="none" variant="solid">
              <Link href={`/${initials}/vehicles/${vehicleSlug}`}>
                {vehicle}
              </Link>
            </Button>
          );
        })}
      </Flex>
    </TitledCard>
  );
}
