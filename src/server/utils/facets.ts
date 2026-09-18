export interface FacetBand {
  key: string;
  test: (value: number) => boolean;
}

export interface CoupledFacetGroup<Entry> {
  matches: (entry: Entry) => boolean;
  tally: (entry: Entry) => void;
}

export interface DisjunctiveFacetSpec<Entry, Key extends string> {
  coupled?: CoupledFacetGroup<Entry>;
  include?: (entry: Entry) => boolean;
  keys: readonly Key[];
  matches: (key: Key, entry: Entry) => boolean;
  tally: (key: Key, entry: Entry) => void;
}

export function matchesAnyBand(
  bands: readonly FacetBand[],
  selected: ReadonlySet<string>,
  value: number,
): boolean {
  if (selected.size === 0) return true;
  return bands.some((band) => selected.has(band.key) && band.test(value));
}

export function seedCounts(keys: readonly string[]): Map<string, number> {
  return new Map(keys.map((key) => [key, 0]));
}

export function bumpCount(counts: Map<string, number>, key: string): void {
  const current = counts.get(key);
  if (current !== undefined) counts.set(key, current + 1);
}

export function bumpBandCounts(
  counts: Map<string, number>,
  bands: readonly FacetBand[],
  value: number,
): void {
  for (const band of bands) {
    if (band.test(value)) bumpCount(counts, band.key);
  }
}

export function listCounts(
  keys: readonly string[],
  counts: Map<string, number>,
): [string, number][] {
  return keys.map((key) => [key, counts.get(key) ?? 0]);
}

export function bandKeys(bands: readonly FacetBand[]): string[] {
  return bands.map((band) => band.key);
}

export function countDisjunctiveFacets<Entry, Key extends string>(
  entries: Iterable<Entry>,
  { coupled, include, keys, matches, tally }: DisjunctiveFacetSpec<Entry, Key>,
): void {
  for (const entry of entries) {
    if (include && !include(entry)) continue;

    let failures = 0;
    let failedKey: Key | null = null;
    for (const key of keys) {
      if (matches(key, entry)) continue;
      failures += 1;
      if (failures > 1) break;
      failedKey = key;
    }
    if (failures > 1) continue;

    if (!failedKey) coupled?.tally(entry);
    if (coupled && !coupled.matches(entry)) continue;

    if (failedKey) tally(failedKey, entry);
    else for (const key of keys) tally(key, entry);
  }
}
