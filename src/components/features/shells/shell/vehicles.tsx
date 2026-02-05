import { Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import { Button } from '@/components/ui/button';
import TitledCard from '@/components/wiki/titledCard';
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
      <Flex flexWrap="wrap" gap={2} as="ul">
        {shell.vehicles.map((vehicle) => {
          const vehicleSlug = slug(vehicle);

          return (
            <li key={vehicle}>
              <Button asChild variant="surface">
                <NextLink href={`/${initials}/vehicles/${vehicleSlug}`}>
                  {vehicle}
                </NextLink>
              </Button>
            </li>
          );
        })}
      </Flex>
    </TitledCard>
  );
}
