export interface ShellQuery {
  displayTypes?: string[];
  typeIncludes?: string;
  eraTip?: number;
}

export interface ShellQuerySource {
  name: string;
  slug: string;
  type: string;
  displayType: string;
  eraTip?: number;
  maxPenetration: number;
}

export interface ShellQueryResult {
  name: string;
  slug: string;
  displayType: string;
  maxPenetration: number;
  weapons: string[];
}

const ERA_TIP_TOLERANCE = 0.001;

export function queryShells(
  shells: Record<string, ShellQuerySource[]>,
  { displayTypes, eraTip, typeIncludes }: ShellQuery,
): ShellQueryResult[] {
  if (!displayTypes?.length && eraTip === undefined && !typeIncludes) {
    return [];
  }

  const wantedType = typeIncludes?.toLowerCase();

  const wantedTypes = new Set(
    (displayTypes ?? []).map((type) => type.toLowerCase()),
  );
  const results = new Map<string, ShellQueryResult>();

  for (const [weapon, weaponShells] of Object.entries(shells)) {
    for (const shell of weaponShells) {
      if (
        wantedTypes.size > 0 &&
        !wantedTypes.has(shell.displayType.toLowerCase())
      ) {
        continue;
      }
      if (wantedType && !shell.type.toLowerCase().includes(wantedType)) {
        continue;
      }
      if (
        eraTip !== undefined &&
        Math.abs((shell.eraTip ?? 0) - eraTip) > ERA_TIP_TOLERANCE
      ) {
        continue;
      }

      const key = `${shell.name}\n${shell.displayType}`;
      const existing = results.get(key);
      if (existing) {
        existing.weapons.push(weapon);
        existing.maxPenetration = Math.max(
          existing.maxPenetration,
          shell.maxPenetration,
        );
        continue;
      }

      results.set(key, {
        name: shell.name,
        slug: shell.slug,
        displayType: shell.displayType,
        maxPenetration: shell.maxPenetration,
        weapons: [weapon],
      });
    }
  }

  return [...results.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true }),
  );
}
