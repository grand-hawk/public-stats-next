export const STAT_ARTICLES = {
  antiEra: 'anti-era-round',
  aps: 'active-protection-system',
  armour: 'armour-and-penetration',
  damage: 'damage',
  engine: 'engine',
  era: 'explosive-reactive-armour',
  gradeability: 'transmission#gradeability',
  maxPenetration: 'penetration',
  neutralSteering: 'steering#neutral-steering',
  ricochetAngle: 'ricochet',
  slat: 'slat-armour',
  steering: 'steering',
  tandem: 'tandem-warhead',
  tier: 'tier',
  transmission: 'transmission',
} as const;

export type StatArticleKey = keyof typeof STAT_ARTICLES;
