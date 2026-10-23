const HP_PER_PS = 0.98632;

export type PowerUnit = 'HP' | 'PS';

export const POWER_UNIT_LABELS: Record<PowerUnit, string> = {
  HP: 'hp',
  PS: 'PS',
};

export function fromHorsepower(horsepower: number, unit: PowerUnit) {
  return unit === 'PS' ? horsepower / HP_PER_PS : horsepower;
}
