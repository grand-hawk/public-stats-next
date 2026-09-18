export const WEIGHT_BANDS = [
  { key: 'light', label: '≤ 10', test: (t: number) => t > 0 && t <= 10 },
  { key: 'medium', label: '11–25', test: (t: number) => t > 10 && t <= 25 },
  { key: 'heavy', label: '26–45', test: (t: number) => t > 25 && t <= 45 },
  { key: 'vheavy', label: '46–60', test: (t: number) => t > 45 && t <= 60 },
  { key: 'xheavy', label: '61+', test: (t: number) => t > 60 },
] as const;

export const POWER_BANDS = [
  { key: 'slug', label: '≤ 12', test: (p: number) => p > 0 && p <= 12 },
  { key: 'modest', label: '13–18', test: (p: number) => p > 12 && p <= 18 },
  { key: 'brisk', label: '19–25', test: (p: number) => p > 18 && p <= 25 },
  { key: 'rapid', label: '26+', test: (p: number) => p > 25 },
] as const;

export const SPEED_BANDS = [
  { key: 'slow', label: '≤ 40', test: (s: number) => s > 0 && s <= 40 },
  { key: 'medium', label: '41–65', test: (s: number) => s > 40 && s <= 65 },
  { key: 'fast', label: '66–90', test: (s: number) => s > 65 && s <= 90 },
  { key: 'vfast', label: '91+', test: (s: number) => s > 90 },
] as const;

export const CREW_BANDS = [
  { key: 'two', label: '≤ 2', test: (c: number) => c > 0 && c <= 2 },
  { key: 'three', label: '3', test: (c: number) => c === 3 },
  { key: 'four', label: '4', test: (c: number) => c === 4 },
  { key: 'five', label: '5', test: (c: number) => c === 5 },
  { key: 'six', label: '6+', test: (c: number) => c >= 6 },
] as const;

export type WeightBand = (typeof WEIGHT_BANDS)[number]['key'];
export type PowerBand = (typeof POWER_BANDS)[number]['key'];
export type SpeedBand = (typeof SPEED_BANDS)[number]['key'];
export type CrewBand = (typeof CREW_BANDS)[number]['key'];
