import {
  buildBrowseIndex,
  buildShellTypeOptions,
} from '@/server/api/trpc/routers/shells/browseIndex';
import {
  buildShellPredicates,
  buildShellQueryPredicate,
  buildWeaponQueryPredicate,
} from '@/server/api/trpc/routers/shells/predicates';
import {
  bandKeys,
  bumpBandCounts,
  bumpCount,
  countDisjunctiveFacets,
  listCounts,
  seedCounts,
} from '@/server/utils/facets';
import {
  CALIBRE_BANDS,
  DAMAGE_BANDS,
  EXP_MASS_BANDS,
  MASS_BANDS,
  PEN_BANDS,
  VEL_BANDS,
} from '@/utils/filters/shellBands';

import type { ShellSearchInput } from '@/server/api/trpc/routers/shells/input';
import type { ShellGroupKey } from '@/server/api/trpc/routers/shells/predicates';
import type {
  BrowseIndexEntry,
  BrowseWeaponGroup,
  ShellPropertyKey,
  ShellSearchFacets,
} from '@/server/api/trpc/routers/shells/types';
import type { PlaceId } from '@generated/config';

interface CountedShell {
  calibre: number;
  entry: BrowseIndexEntry;
  weaponMatches: boolean;
}

function* countedShells(
  weapons: readonly BrowseWeaponGroup[],
  matchesWeapon: (simplifiedWeapon: string) => boolean,
): Generator<CountedShell> {
  for (const group of weapons) {
    const weaponMatches = matchesWeapon(group.simplifiedWeapon);
    for (const entry of group.entries) {
      yield { calibre: group.calibre, entry, weaponMatches };
    }
  }
}

export function computeShellFacets(input: ShellSearchInput): ShellSearchFacets {
  const placeId = input.placeId as PlaceId;
  const weapons = buildBrowseIndex(placeId);
  const typeOptions = buildShellTypeOptions(placeId);

  const predicates = buildShellPredicates(input);
  const matchesQuery = buildShellQueryPredicate(input);
  const matchesWeapon = buildWeaponQueryPredicate(input);
  const groupKeys = Object.keys(predicates) as ShellGroupKey[];

  const calibreCounts = seedCounts(bandKeys(CALIBRE_BANDS));
  const damageCounts = seedCounts(bandKeys(DAMAGE_BANDS));
  const expMassCounts = seedCounts(bandKeys(EXP_MASS_BANDS));
  const massCounts = seedCounts(bandKeys(MASS_BANDS));
  const penCounts = seedCounts(bandKeys(PEN_BANDS));
  const typeCounts = seedCounts(typeOptions);
  const velCounts = seedCounts(bandKeys(VEL_BANDS));

  const propertyCounts: Record<ShellPropertyKey, number> = {
    explosive: 0,
    guided: 0,
    irccm: 0,
    laser: 0,
    unjammable: 0,
  };

  const tallies: Record<
    ShellGroupKey,
    (entry: BrowseIndexEntry, calibre: number) => void
  > = {
    calibres: (_entry, calibre) =>
      bumpBandCounts(calibreCounts, CALIBRE_BANDS, calibre),
    damage: (entry) =>
      bumpBandCounts(damageCounts, DAMAGE_BANDS, entry.shell.damage),
    explosive: (entry) => {
      if (entry.shell.hasExplosive) propertyCounts.explosive += 1;
    },
    explosiveMass: (entry) =>
      bumpBandCounts(expMassCounts, EXP_MASS_BANDS, entry.shell.explosiveMass),
    guided: (entry) => {
      if (entry.shell.isGuided) propertyCounts.guided += 1;
    },
    irccm: (entry) => {
      if (entry.shell.hasIRCCM) propertyCounts.irccm += 1;
    },
    laser: (entry) => {
      if (entry.shell.isLaser) propertyCounts.laser += 1;
    },
    mass: (entry) => bumpBandCounts(massCounts, MASS_BANDS, entry.shell.mass),
    penetration: (entry) =>
      bumpBandCounts(penCounts, PEN_BANDS, entry.shell.maxPenetration),
    types: (entry) => bumpCount(typeCounts, entry.typeKey),
    unjammable: (entry) => {
      if (entry.shell.isUnjammable) propertyCounts.unjammable += 1;
    },
    velocity: (entry) =>
      bumpBandCounts(velCounts, VEL_BANDS, entry.shell.velocity),
  };

  countDisjunctiveFacets(countedShells(weapons, matchesWeapon), {
    include: ({ entry, weaponMatches }) => matchesQuery(entry, weaponMatches),
    keys: groupKeys,
    matches: (key, { calibre, entry }) => predicates[key](entry, calibre),
    tally: (key, { calibre, entry }) => tallies[key](entry, calibre),
  });

  return {
    calibres: listCounts(bandKeys(CALIBRE_BANDS), calibreCounts),
    damage: listCounts(bandKeys(DAMAGE_BANDS), damageCounts),
    explosiveMass: listCounts(bandKeys(EXP_MASS_BANDS), expMassCounts),
    mass: listCounts(bandKeys(MASS_BANDS), massCounts),
    penetration: listCounts(bandKeys(PEN_BANDS), penCounts),
    properties: propertyCounts,
    types: listCounts(typeOptions, typeCounts),
    velocity: listCounts(bandKeys(VEL_BANDS), velCounts),
  };
}
