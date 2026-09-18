import { buildBrowseIndex } from '@/server/api/trpc/routers/shells/browseIndex';
import {
  buildShellPredicates,
  buildShellQueryPredicate,
  buildWeaponQueryPredicate,
} from '@/server/api/trpc/routers/shells/predicates';

import type { ShellSearchInput } from '@/server/api/trpc/routers/shells/input';
import type {
  ListedShellForBrowse,
  ShellsListForBrowse,
} from '@/server/api/trpc/routers/shells/types';
import type { PlaceId } from '@generated/config';

export function searchShells(input: ShellSearchInput): ShellsListForBrowse {
  const weapons = buildBrowseIndex(input.placeId as PlaceId);

  const predicates = Object.values(buildShellPredicates(input));
  const matchesQuery = buildShellQueryPredicate(input);
  const matchesWeapon = buildWeaponQueryPredicate(input);

  const result: ShellsListForBrowse = {};

  for (const group of weapons) {
    const weaponMatches = matchesWeapon(group.simplifiedWeapon);

    const matching: ListedShellForBrowse[] = [];
    for (const entry of group.entries) {
      if (!matchesQuery(entry, weaponMatches)) continue;
      if (!predicates.every((predicate) => predicate(entry, group.calibre))) {
        continue;
      }

      matching.push(entry.shell);
    }

    if (matching.length > 0) result[group.weapon] = matching;
  }

  return result;
}
