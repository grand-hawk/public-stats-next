import { TRPCError } from '@trpc/server';

import { SHELL_TYPES, shellTypeKey } from '@/utils/filters/shellTypes';
import { simplifyString } from '@/utils/simplifyString';
import { getShells } from '@generated/shells';

import type {
  BrowseIndexEntry,
  BrowseWeaponGroup,
  ListedShellBase,
  ListedShellForBrowse,
} from '@/server/api/trpc/routers/shells/types';
import type { PlaceId } from '@generated/config';
import type { ShellsPlaceDataShell } from '@generated/shells';

const CALIBRE_PATTERN = /([0-9]+(?:\.[0-9]+)?)\s*mm/i;

const browseIndexCache = new Map<PlaceId, BrowseWeaponGroup[]>();
const shellTypeOptionsCache = new Map<PlaceId, string[]>();

function weaponCalibre(weapon: string, shells: ShellsPlaceDataShell[]): number {
  const diameters = shells
    .map((shell) => shell.projectileDiameter)
    .filter((diameter): diameter is number => typeof diameter === 'number');
  if (diameters.length > 0) return Math.max(...diameters);

  const matched = CALIBRE_PATTERN.exec(weapon);
  return matched ? Number.parseFloat(matched[1]) : 0;
}

function shellsByWeapon(placeId: PlaceId): [string, ShellsPlaceDataShell[]][] {
  const shellsData = getShells().data[placeId]?.data;
  if (!shellsData) throw new TRPCError({ code: 'NOT_FOUND' });

  return Object.entries(shellsData).sort((a, b) => a[0].localeCompare(b[0]));
}

export function buildBrowseIndex(placeId: PlaceId): BrowseWeaponGroup[] {
  const cached = browseIndexCache.get(placeId);
  if (cached) return cached;

  const weapons = shellsByWeapon(placeId).map(([weapon, shellArr]) => ({
    calibre: weaponCalibre(weapon, shellArr),
    entries: shellArr.map((shell): BrowseIndexEntry => {
      const listed: ListedShellForBrowse = {
        damage: shell.damage,
        displayType: shell.displayType,
        explosiveMass: shell.explosive?.mass ?? 0,
        hasExplosive: !!shell.explosive,
        hasIRCCM: shell.missile?.irccm ?? false,
        isGuided: !!shell.missile,
        isLaser: shell.laser ?? false,
        isUnjammable: shell.missile?.unjammable ?? false,
        mass: shell.mass,
        maxPenetration: shell.maxPenetration,
        name: shell.name,
        slug: shell.slug,
        vehicles: shell.vehicles,
        velocity: shell.velocity,
      };
      return {
        shell: listed,
        simplifiedName: simplifyString(shell.name),
        simplifiedVehicles: shell.vehicles.map(simplifyString),
        typeKey: shellTypeKey(shell.type),
      };
    }),
    simplifiedWeapon: simplifyString(weapon),
    weapon,
  }));

  browseIndexCache.set(placeId, weapons);
  return weapons;
}

export function buildShellTypeOptions(placeId: PlaceId): string[] {
  const cached = shellTypeOptionsCache.get(placeId);
  if (cached) return cached;

  const present = new Set<string>();
  for (const group of buildBrowseIndex(placeId)) {
    for (const entry of group.entries) present.add(entry.typeKey);
  }

  const options = SHELL_TYPES.filter((entry) => present.has(entry.key)).map(
    (entry) => entry.key,
  );
  shellTypeOptionsCache.set(placeId, options);
  return options;
}

export function listShellsBase(
  placeId: PlaceId,
): Record<string, ListedShellBase[]> {
  return Object.fromEntries(
    shellsByWeapon(placeId).map(([weapon, shellArr]) => [
      weapon,
      shellArr.map((shell): ListedShellBase => ({
        displayType: shell.displayType,
        name: shell.name,
        slug: shell.slug,
        vehicles: shell.vehicles,
      })),
    ]),
  );
}
