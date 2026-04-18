export function sortedArray<T extends string>(set: Set<T>): T[] {
  return [...set].sort();
}
