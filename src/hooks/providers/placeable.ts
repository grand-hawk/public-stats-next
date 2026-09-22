import React from 'react';

import type { DetailedPlaceable } from '@/server/api/trpc/routers/placeables';

export const PlaceableContext = React.createContext<DetailedPlaceable>(
  {} as DetailedPlaceable,
);

export function usePlaceable() {
  return React.useContext(PlaceableContext);
}
