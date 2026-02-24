import type { DamageModule } from './mtca';

export interface ModuleGroupRule {
  initiallyHidden?: boolean;
  label: string;
  match: (name: string) => boolean;
}

export interface ModuleGroup {
  indices: number[];
  initiallyHidden: boolean;
  label: string;
}

export const moduleGroupRules: ModuleGroupRule[] = [
  {
    label: 'Tracks',
    match: (n) => /track/i.test(n),
    initiallyHidden: true,
  },
  {
    label: 'Turret rings',
    match: (n) => /Turret\d+Ring/i.test(n),
    initiallyHidden: true,
  },
  {
    label: 'Turret breeches',
    match: (n) => /Turret\d+Breech/i.test(n),
    initiallyHidden: true,
  },
  {
    label: 'Turret barrels',
    match: (n) => /Turret\d+Barrel/i.test(n) || /Barrel$/i.test(n),
    initiallyHidden: true,
  },
  {
    label: 'Ammo blowout',
    match: (n) => /AmmoModel\d+BlowoutDoor/i.test(n),
  },
  {
    label: 'Ammo',
    match: (n) => /AmmoModel\d+/i.test(n),
  },
  {
    label: 'Sights',
    match: (n) => /Turret.*Sight/i.test(n),
  },
  {
    label: 'APS',
    match: (n) => /APS.*/i.test(n),
    initiallyHidden: true,
  },
  {
    label: 'Engine',
    match: (n) => n === 'Engine',
    initiallyHidden: true,
  },
  {
    label: 'Transmission',
    match: (n) => n === 'Transmission',
    initiallyHidden: true,
  },
  {
    label: 'FuelTank',
    match: (n) => n === 'FuelTank',
  },
];

export function groupModules(modules: DamageModule[]): ModuleGroup[] {
  const groups: ModuleGroup[] = [];
  const claimed = new Set<number>();

  for (const rule of moduleGroupRules) {
    const indices: number[] = [];
    for (let i = 0; i < modules.length; i++) {
      if (rule.match(modules[i].name)) {
        indices.push(i + 1);
        claimed.add(i);
      }
    }
    if (indices.length > 0) {
      groups.push({
        indices,
        initiallyHidden: rule.initiallyHidden ?? false,
        label: rule.label,
      });
    }
  }

  for (let i = 0; i < modules.length; i++) {
    if (!claimed.has(i)) {
      groups.push({
        indices: [i + 1],
        initiallyHidden: false,
        label: modules[i].name,
      });
    }
  }

  return groups;
}
