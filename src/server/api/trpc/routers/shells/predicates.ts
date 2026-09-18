import { matchesAnyBand } from '@/server/utils/facets';
import {
  CALIBRE_BANDS,
  DAMAGE_BANDS,
  EXP_MASS_BANDS,
  MASS_BANDS,
  PEN_BANDS,
  VEL_BANDS,
} from '@/utils/filters/shellBands';
import { simplifyString } from '@/utils/simplifyString';

import type { ShellSearchInput } from '@/server/api/trpc/routers/shells/input';
import type {
  BrowseIndexEntry,
  ShellPropertyKey,
} from '@/server/api/trpc/routers/shells/types';

export type ShellGroupKey =
  | 'calibres'
  | 'damage'
  | 'explosiveMass'
  | 'mass'
  | 'penetration'
  | 'types'
  | 'velocity'
  | ShellPropertyKey;

export type ShellPredicate = (
  entry: BrowseIndexEntry,
  calibre: number,
) => boolean;

export function buildShellPredicates(
  input: ShellSearchInput,
): Record<ShellGroupKey, ShellPredicate> {
  const calibres = new Set(input.calibres);
  const damage = new Set(input.damage);
  const explosiveMass = new Set(input.explosiveMass);
  const mass = new Set(input.mass);
  const penetration = new Set(input.penetration);
  const types = new Set(input.types);
  const velocity = new Set(input.velocity);

  return {
    calibres: (_entry, calibre) =>
      matchesAnyBand(CALIBRE_BANDS, calibres, calibre),
    damage: (entry) => matchesAnyBand(DAMAGE_BANDS, damage, entry.shell.damage),
    explosive: (entry) => !input.explosive || entry.shell.hasExplosive,
    explosiveMass: (entry) =>
      matchesAnyBand(EXP_MASS_BANDS, explosiveMass, entry.shell.explosiveMass),
    guided: (entry) => !input.guided || entry.shell.isGuided,
    irccm: (entry) => !input.irccm || entry.shell.hasIRCCM,
    laser: (entry) => !input.laser || entry.shell.isLaser,
    mass: (entry) => matchesAnyBand(MASS_BANDS, mass, entry.shell.mass),
    penetration: (entry) =>
      matchesAnyBand(PEN_BANDS, penetration, entry.shell.maxPenetration),
    types: (entry) => types.size === 0 || types.has(entry.typeKey),
    unjammable: (entry) => !input.unjammable || entry.shell.isUnjammable,
    velocity: (entry) =>
      matchesAnyBand(VEL_BANDS, velocity, entry.shell.velocity),
  };
}

export function buildShellQueryPredicate(
  input: ShellSearchInput,
): (entry: BrowseIndexEntry, weaponMatches: boolean) => boolean {
  const normalizedQuery = input.query ? simplifyString(input.query) : null;

  return (entry, weaponMatches) => {
    if (!normalizedQuery) return true;
    if (weaponMatches) return true;
    if (entry.simplifiedName.includes(normalizedQuery)) return true;
    return entry.simplifiedVehicles.some((vehicle) =>
      vehicle.includes(normalizedQuery),
    );
  };
}

export function buildWeaponQueryPredicate(
  input: ShellSearchInput,
): (simplifiedWeapon: string) => boolean {
  const normalizedQuery = input.query ? simplifyString(input.query) : null;
  return (simplifiedWeapon) =>
    !!normalizedQuery && simplifiedWeapon.includes(normalizedQuery);
}
