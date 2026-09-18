export interface FilterOption<T extends string = string> {
  count?: number;
  key: T;
  label: string;
}

export interface LabelledKey<T extends string> {
  key: T;
  label: string;
}

export function bandOptions<T extends string>(
  bands: readonly LabelledKey<T>[],
  counts: readonly [string, number][],
): FilterOption<T>[] {
  const byKey = new Map(counts);
  return bands.map((band) => ({
    count: byKey.get(band.key),
    key: band.key,
    label: band.label,
  }));
}

export function facetOptions(
  facet: readonly [string, number][],
  label: (key: string) => string = (key) => key,
): FilterOption[] {
  return facet.map(([key, count]) => ({ count, key, label: label(key) }));
}

export function countedOptions<T extends string>(
  options: readonly LabelledKey<T>[],
  counts: Record<T, number>,
): FilterOption<T>[] {
  return options.map((option) => ({
    count: counts[option.key],
    key: option.key,
    label: option.label,
  }));
}
