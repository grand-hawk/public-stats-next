const GEAR_COLORS = [
  'blue.solid',
  'orange.solid',
  'green.solid',
  'purple.solid',
  'cyan.solid',
  'pink.solid',
  'yellow.solid',
  'teal.solid',
  'red.solid',
];

export const CHART_MARGIN = { bottom: 0, left: 0, right: 24, top: 20 };

export const gearWord = (stepless: boolean) => (stepless ? 'Range' : 'Gear');

export const gearLabel = (gear: number, stepless: boolean) =>
  `${gearWord(stepless)} ${gear}`;

export const gearSeries = (gears: { gear: number }[], stepless = false) =>
  gears.map((gear, index) => ({
    color: GEAR_COLORS[index % GEAR_COLORS.length],
    label: gearLabel(gear.gear, stepless),
    name: `gear${gear.gear}`,
  }));

export const speedGrid = (maxKmh: number, extra: number[]) =>
  [
    ...new Set([
      ...Array.from({ length: Math.floor(maxKmh) + 1 }, (_, index) => index),
      ...extra,
    ]),
  ].sort((a, b) => a - b);
