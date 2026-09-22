import type {
  InfantryWeaponFireMode,
  InfantryWeaponSlot,
} from '@generated/infantry_weapons';

export const INFANTRY_WEAPONS_PATH = '/weapons';

export type InfantryWeaponCategoryKey =
  'smallArms' | 'antiTank' | 'antiAir' | 'explosive';

export interface InfantryWeaponCategory {
  key: InfantryWeaponCategoryKey;
  label: string;
  description: string;
}

export const INFANTRY_WEAPON_CATEGORIES: InfantryWeaponCategory[] = [
  {
    key: 'smallArms',
    label: 'Small arms',
    description: 'Rifles, machine guns, pistols and anti-tank rifles.',
  },
  {
    key: 'antiTank',
    label: 'Anti-tank launchers',
    description: 'Shoulder-fired HEAT and tandem warheads.',
  },
  {
    key: 'explosive',
    label: 'Explosive launchers',
    description: 'Launchers that fire high-explosive or incendiary rounds.',
  },
  {
    key: 'antiAir',
    label: 'Anti-air launchers',
    description: 'Shoulder-fired surface-to-air missiles.',
  },
];

const BASE_FOV = 70;

const FIRE_MODE_LABELS: Record<InfantryWeaponFireMode, string> = {
  auto: 'Automatic',
  bolt: 'Bolt action',
  burst: 'Burst',
  pump: 'Pump action',
  semi: 'Semi-automatic',
};

const SLOT_LABELS: Record<InfantryWeaponSlot, string> = {
  PassiveTools: 'Tool',
  Primary: 'Primary',
  Secondary: 'Secondary',
  Tertiary: 'Tertiary',
};

export function infantryWeaponCategory(projectile?: {
  displayType: string;
  type: string;
}): InfantryWeaponCategoryKey {
  if (!projectile) return 'smallArms';
  if (projectile.type.includes('SURFACE-TO-AIR')) return 'antiAir';
  if (projectile.displayType === 'HEAT') return 'antiTank';
  if (projectile.displayType === 'HE') return 'explosive';
  return 'smallArms';
}

export function cyclesByFireRate(weapon: {
  fireModes: string[];
  magazineSize?: number;
}) {
  return (
    (weapon.magazineSize ?? 0) > 1 &&
    !weapon.fireModes.some((mode) => mode === 'bolt' || mode === 'pump')
  );
}

export function rateOfFireLabel(weapon: {
  fireModes: InfantryWeaponFireMode[];
  magazineSize?: number;
  rpm?: number;
}) {
  if (weapon.magazineSize === 1) return 'Single shot';

  const manual = weapon.fireModes.find(
    (mode) => mode === 'bolt' || mode === 'pump',
  );
  if (manual) return FIRE_MODE_LABELS[manual];

  return weapon.rpm ? `${weapon.rpm}/min` : 'Unknown';
}

export function infantryWeaponIcon(projectile?: {
  displayType: string;
  type: string;
}) {
  if (!projectile) return '';

  const type = projectile.type.toUpperCase();
  if (type.includes('SURFACE-TO-AIR')) return 'AAM';
  if (type.includes('F&F')) return 'F&F Top Attack ATGM';
  if (type.includes('TANDEM')) return 'ATGM TANDEM';
  if (projectile.displayType === 'HEAT') return 'ROCKET';
  return projectile.displayType;
}

export function fireModeLabel(mode: InfantryWeaponFireMode) {
  return FIRE_MODE_LABELS[mode];
}

export function slotLabel(slot: InfantryWeaponSlot) {
  return SLOT_LABELS[slot];
}

const SLOT_ORDER: InfantryWeaponSlot[] = [
  'Primary',
  'Secondary',
  'Tertiary',
  'PassiveTools',
];

export function slotIndex(slot: InfantryWeaponSlot) {
  return SLOT_ORDER.indexOf(slot);
}

export function sightMagnification(fov: number) {
  const half = (degrees: number) => Math.tan((degrees * Math.PI) / 360);
  return half(BASE_FOV) / half(fov);
}
