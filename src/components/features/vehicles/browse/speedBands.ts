export const SPEED_BANDS = [
  { key: 'slow', label: '≤ 40', test: (s: number) => s > 0 && s <= 40 },
  { key: 'medium', label: '41–65', test: (s: number) => s > 40 && s <= 65 },
  { key: 'fast', label: '66–90', test: (s: number) => s > 65 && s <= 90 },
  { key: 'vfast', label: '91+', test: (s: number) => s > 90 },
] as const;

export type SpeedBand = (typeof SPEED_BANDS)[number]['key'];
