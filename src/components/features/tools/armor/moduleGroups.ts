import type { DamageModule } from './mtca';

export interface ModuleGroupRule {
  label: string;
  match: (name: string) => boolean;
}

export interface ModuleGroup {
  indices: number[];
  label: string;
}

export const moduleGroupRules: ModuleGroupRule[] = [
  { label: 'Tracks', match: (n) => /track/i.test(n) },
  { label: 'Turret rings', match: (n) => /Turret\d+Ring/i.test(n) },
  { label: 'Turret breeches', match: (n) => /Turret\d+Breech/i.test(n) },
  { label: 'Turret barrels', match: (n) => /Turret\d+Barrel/i.test(n) },
  { label: 'Ammo models', match: (n) => /AmmoModel\d+/i.test(n) },
  { label: 'Sights', match: (n) => /Turret.*Sight/i.test(n) },
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
    if (indices.length > 0) groups.push({ indices, label: rule.label });
  }

  for (let i = 0; i < modules.length; i++) {
    if (!claimed.has(i)) {
      groups.push({ indices: [i + 1], label: modules[i].name });
    }
  }

  return groups;
}
