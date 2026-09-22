import { capitalizeFirst } from '@/utils/capitalizeFirst';

import type {
  PlaceableAvailability,
  PlaceableBuildAvailability,
  PlaceableLoadoutAvailability,
} from '@/server/api/trpc/routers/placeables';
import type { PlaceableKind } from '@generated/placeables';

export const PLACEABLES_PATH = '/placeables';

export interface PlaceableKindInfo {
  key: PlaceableKind;
  label: string;
  description: string;
}

export const PLACEABLE_KINDS: PlaceableKindInfo[] = [
  {
    key: 'weapon',
    label: 'Weapon emplacements',
    description:
      'Crew-served guns, autocannons and missile launchers, manned once placed.',
  },
  {
    key: 'vehicle',
    label: 'Vehicle placeables',
    description:
      'Add-on protection for vehicles, from reactive blocks to sandbags and slat screens.',
  },
  {
    key: 'engineer',
    label: 'Structures',
    description: 'Trenches, bunkers, obstacles, bridges and decoys.',
  },
  {
    key: 'offensive',
    label: 'Explosives',
    description: 'Charges that are placed on a target and set off.',
  },
];

export function placeableDisplayName(name: string) {
  if (name.includes(' ')) return name;
  return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function buildToolLabel(tool: string) {
  return capitalizeFirst(tool.toLowerCase());
}

export function placeableKindLabel(kind: PlaceableKind) {
  return PLACEABLE_KINDS.find((entry) => entry.key === kind)?.label ?? kind;
}

export function isBuildAvailability(
  entry: PlaceableAvailability,
): entry is PlaceableBuildAvailability {
  return entry.via === 'buildTool';
}

export function isLoadoutAvailability(
  entry: PlaceableAvailability,
): entry is PlaceableLoadoutAvailability {
  return entry.via === 'loadout';
}
