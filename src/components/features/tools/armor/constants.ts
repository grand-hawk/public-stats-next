import type { ArmorAngle } from '@/utils/getVehicleImage';

export const ARMOR_CDN_BASE = 'https://cdn.astrid.ovh/public-stats-images';
export const DEFAULT_ARMOR_ANGLE: ArmorAngle = 'front';
export const DEFAULT_RICOCHET_ANGLE = 82.5;
export const VALID_ARMOR_ANGLES: ArmorAngle[] = [
  'front',
  'front_30',
  'front_-30',
  'left',
  'right',
  'back',
  'top',
];
