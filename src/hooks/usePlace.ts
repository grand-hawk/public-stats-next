import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';

export function usePlace() {
  const data = useSuspenseConfig();
  const initials = usePlaceInitials();
  if (!initials) return null;

  const name = getNameFromInitials(data, initials);
  if (!name) return null;

  return getPlaceFromName(data, name);
}
