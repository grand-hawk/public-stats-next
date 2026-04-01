export const MASS_BANDS = [
  {
    key: 'light',
    label: '≤15',
    test: (m: number) => m > 0 && m <= 15,
  },
  {
    key: 'medium',
    label: '16–35',
    test: (m: number) => m > 15 && m <= 35,
  },
  {
    key: 'heavy',
    label: '36–70',
    test: (m: number) => m > 35 && m <= 70,
  },
  {
    key: 'veryheavy',
    label: '71+',
    test: (m: number) => m > 70,
  },
] as const;

export const EXP_MASS_BANDS = [
  {
    key: 'none',
    label: 'None',
    test: (m: number) => m === 0,
  },
  {
    key: 'small',
    label: '≤1',
    test: (m: number) => m > 0 && m <= 1,
  },
  {
    key: 'med',
    label: '1–8',
    test: (m: number) => m > 1 && m <= 8,
  },
  {
    key: 'large',
    label: '8+',
    test: (m: number) => m > 8,
  },
] as const;

export const DAMAGE_BANDS = [
  {
    key: 'vlow',
    label: '≤100',
    test: (d: number) => d <= 100,
  },
  {
    key: 'cluster',
    label: '101–500',
    test: (d: number) => d > 100 && d <= 500,
  },
  {
    key: 'mid',
    label: '501–2000',
    test: (d: number) => d > 500 && d <= 2000,
  },
  {
    key: 'high',
    label: '2001+',
    test: (d: number) => d > 2000,
  },
] as const;

export const PEN_BANDS = [
  {
    key: 'low',
    label: '< 150',
    test: (p: number) => p < 150,
  },
  {
    key: 'med',
    label: '150–300',
    test: (p: number) => p >= 150 && p <= 300,
  },
  {
    key: 'high',
    label: '301–500',
    test: (p: number) => p > 300 && p <= 500,
  },
  {
    key: 'vhigh',
    label: '501–750',
    test: (p: number) => p > 500 && p <= 750,
  },
  {
    key: 'extreme',
    label: '750+',
    test: (p: number) => p > 750,
  },
] as const;

export const VEL_BANDS = [
  {
    key: 'slow',
    label: '≤ 500',
    test: (v: number) => v > 0 && v <= 500,
  },
  {
    key: 'med',
    label: '501–900',
    test: (v: number) => v > 500 && v <= 900,
  },
  {
    key: 'fast',
    label: '901–1300',
    test: (v: number) => v > 900 && v <= 1300,
  },
  {
    key: 'vfast',
    label: '1300+',
    test: (v: number) => v > 1300,
  },
] as const;

export type MassBand = (typeof MASS_BANDS)[number]['key'];
export type ExpMassBand = (typeof EXP_MASS_BANDS)[number]['key'];
export type DamageBand = (typeof DAMAGE_BANDS)[number]['key'];
export type PenBand = (typeof PEN_BANDS)[number]['key'];
export type VelBand = (typeof VEL_BANDS)[number]['key'];

export const MASS_TEST = new Map(MASS_BANDS.map((b) => [b.key, b.test]));
export const EXP_MASS_TEST = new Map(
  EXP_MASS_BANDS.map((b) => [b.key, b.test]),
);
export const DAMAGE_TEST = new Map(DAMAGE_BANDS.map((b) => [b.key, b.test]));
export const PEN_TEST = new Map(PEN_BANDS.map((b) => [b.key, b.test]));
export const VEL_TEST = new Map(VEL_BANDS.map((b) => [b.key, b.test]));

export function matchesAny(
  testByKey: Map<string, (v: number) => boolean>,
  selected: Set<string>,
  value: number,
): boolean {
  if (selected.size === 0) return true;
  for (const key of selected) {
    if (testByKey.get(key)?.(value)) return true;
  }
  return false;
}
