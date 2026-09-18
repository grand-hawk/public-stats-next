export const OBTAINMENT_LABELS: Record<string, string> = {
  badge: 'Badge',
  coins: 'Premium',
  free: 'Free',
  money: 'Shop',
  quest: 'Quest',
};

export function obtainmentLabel(type: string | undefined) {
  const key = type ?? 'free';
  return OBTAINMENT_LABELS[key] ?? key;
}
