import React from 'react';

import { ContextCapturer } from '@/components/development/contextCapturer';
import PlaceableDescription from '@/components/features/placeables/placeable/about';
import PlaceableAvailability from '@/components/features/placeables/placeable/availability';
import PlaceableHeader from '@/components/features/placeables/placeable/header';
import PlaceableProtection from '@/components/features/placeables/placeable/protection';
import PlaceableTurrets from '@/components/features/placeables/placeable/turrets';
import Projectiles from '@/components/features/shells/projectiles';
import { PlaceableContext } from '@/hooks/providers/placeable';

import type { DetailedPlaceable } from '@/server/api/trpc/routers/placeables';

export default function Placeable({
  placeable,
}: {
  placeable: DetailedPlaceable;
}) {
  return (
    <PlaceableContext.Provider value={placeable}>
      <ContextCapturer contextKey="Placeable" data={placeable} />

      <PlaceableHeader />
      <PlaceableDescription />
      <PlaceableAvailability />
      <PlaceableProtection />
      <PlaceableTurrets />

      <Projectiles
        projectiles={placeable.projectiles ?? []}
        weapon={placeable.name}
      />
    </PlaceableContext.Provider>
  );
}
