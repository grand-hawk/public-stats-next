import { relPenetration } from '@/utils/penetration';

import type { ShellsPlaceDataShell } from '@generated/shells';

type PenetrationTable = ShellsPlaceDataShell['penetrationTable'];

export type PenetrationMode = 'los' | 'rel';

export function getPenetrationAngles(table: PenetrationTable) {
  return Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);
}

export function getPenetrationDistances(
  table: PenetrationTable,
  angle: number | undefined,
) {
  if (angle === undefined || !table[angle]) return [];

  return Object.keys(table[angle])
    .map(Number)
    .sort((a, b) => a - b);
}

export function getPenetrationCells(
  table: PenetrationTable,
  angle: number,
  distance: number,
  mode: PenetrationMode,
) {
  const values = table[angle]?.[distance];
  if (!values) return [];

  if (mode === 'los') return values;

  return values.map((value) => Math.round(relPenetration(value, angle)));
}

export function getFirstLosPenetrationAtAngle(
  table: PenetrationTable,
  angle: number,
) {
  const distances = getPenetrationDistances(table, angle);

  for (const distance of distances) {
    const values = table[angle][distance];
    const penetration = values[0];
    if (penetration !== undefined) return penetration;
  }

  return undefined;
}
