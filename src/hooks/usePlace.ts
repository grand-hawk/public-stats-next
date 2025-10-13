import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';

import type { PlaceName } from '@generated/config';

export function usePlace() {
  const initials = usePlaceInitials();
  const data = useSuspenseConfig();

  if (!initials) return null;

  const name = Object.entries(data.placeNameInitials).find(
    ([_, value]) => value === initials,
  )?.[0] as PlaceName | undefined;
  if (!name) return null;

  return {
    initials,
    placeName: name,
    placeId: data.placeIds[name],
    universeId: data.universeIds[name],
  };
}
