export const SHELL_TYPES = [
  { key: 'sabot', label: 'Sabot' },
  { key: 'ap', label: 'Armour-piercing' },
  { key: 'heat', label: 'HEAT' },
  { key: 'hesh', label: 'HESH' },
  { key: 'he', label: 'High explosive' },
  { key: 'missile', label: 'Guided missile' },
  { key: 'rocket', label: 'Rocket' },
  { key: 'smoke', label: 'Smoke' },
  { key: 'mg', label: 'Machine gun' },
] as const;

export type ShellTypeKey = (typeof SHELL_TYPES)[number]['key'];

export const SHELL_TYPE_LABELS = new Map<string, string>(
  SHELL_TYPES.map((entry) => [entry.key, entry.label]),
);

export function shellTypeKey(type: string): ShellTypeKey {
  const value = type.toUpperCase();
  if (value.includes('MISSILE') || value.includes('ATGM')) return 'missile';
  if (value.includes('ROCKET')) return 'rocket';
  if (value.includes('MG')) return 'mg';
  if (value.includes('SMOKE')) return 'smoke';
  if (
    value.includes('APFSDS') ||
    value.includes('APDS') ||
    value.includes('APCR')
  ) {
    return 'sabot';
  }
  if (value.startsWith('AP')) return 'ap';
  if (value.includes('HEAT')) return 'heat';
  if (value.includes('HESH')) return 'hesh';
  return 'he';
}
