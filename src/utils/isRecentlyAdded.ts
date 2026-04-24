const THIRTY_ONE_DAYS_MS = 31 * 24 * 60 * 60 * 1000;

export function isRecentlyAdded(
  addedDate: string | undefined,
): true | undefined {
  if (!addedDate) return undefined;
  const age = Date.now() - new Date(addedDate).getTime();
  return age < THIRTY_ONE_DAYS_MS ? true : undefined;
}
