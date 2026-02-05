import type { ConfigData, PlaceName } from '@generated/config';

export function getNameFromInitials(data: ConfigData, initials: string) {
  const name = Object.entries(data.placeNameInitials).find(
    ([_, value]) => value === initials,
  )?.[0] as PlaceName | undefined;

  return name || null;
}

export function getPlaceFromName(data: ConfigData, name: PlaceName) {
  return {
    initials: data.placeNameInitials[name],
    placeName: name,
    placeId: data.placeIds[name],
    universeId: data.universeIds[name],
  };
}

export type Place = ReturnType<typeof getPlaceFromName>;
