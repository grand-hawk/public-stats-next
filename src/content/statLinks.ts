export const STAT_ARTICLES = {
  antiEra: 'anti-era-round',
  armour: 'armour-and-penetration',
  damage: 'damage',
  maxPenetration: 'penetration',
  ricochetAngle: 'ricochet',
  tandem: 'tandem-warhead',
  tier: 'tier',
} as const;

export type StatArticleKey = keyof typeof STAT_ARTICLES;
