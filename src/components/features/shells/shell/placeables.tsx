import NextLink from 'next/link';
import React from 'react';

import PlaceableCell from '@/components/features/placeables/placeableCell';
import VehicleCellGrid from '@/components/features/teams/loadouts/vehicleCellGrid';
import TitledCard from '@/components/wiki/titledCard';
import { useShell } from '@/hooks/providers/shell';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { PLACEABLES_PATH, placeableDisplayName } from '@/utils/placeables';

export default function ShellPlaceables() {
  const initials = usePlaceInitials()!;
  const shell = useShell();

  if (shell.placeables.length === 0) return null;

  return (
    <TitledCard
      as="section"
      title="Placeables with this shell"
      withAnchor="placeables"
    >
      <VehicleCellGrid>
        {shell.placeables.map((placeable) => (
          <PlaceableCell
            key={placeable.slug}
            initials={initials}
            name={placeable.name}
            slug={placeable.slug}
          />
        ))}
      </VehicleCellGrid>

      <ul data-md-show style={{ display: 'none' }}>
        {shell.placeables.map((placeable) => (
          <li key={placeable.slug}>
            <NextLink
              href={`/${initials}${PLACEABLES_PATH}/${placeable.slug}`}
              prefetch={false}
            >
              {placeableDisplayName(placeable.name)}
            </NextLink>
          </li>
        ))}
      </ul>
    </TitledCard>
  );
}
