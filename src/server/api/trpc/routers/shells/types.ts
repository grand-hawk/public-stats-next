import type { ShellsPlaceDataShell } from '@generated/shells';
import type { BreadcrumbList, WithContext } from 'schema-dts';

export interface ListedShellBase {
  displayType: string;
  name: string;
  slug: string;
  vehicles: string[];
}

export interface ListedShellForBrowse extends ListedShellBase {
  damage: number;
  explosiveMass: number;
  hasExplosive: boolean;
  hasIRCCM: boolean;
  isGuided: boolean;
  isLaser: boolean;
  isUnjammable: boolean;
  mass: number;
  maxPenetration: number;
  velocity: number;
}

export type ShellsListForBrowse = Record<string, ListedShellForBrowse[]>;

export type ShellPropertyKey =
  'explosive' | 'guided' | 'irccm' | 'laser' | 'unjammable';

export interface ShellSearchFacets {
  calibres: [string, number][];
  damage: [string, number][];
  explosiveMass: [string, number][];
  mass: [string, number][];
  penetration: [string, number][];
  properties: Record<ShellPropertyKey, number>;
  types: [string, number][];
  velocity: [string, number][];
}

export interface BrowseIndexEntry {
  shell: ListedShellForBrowse;
  simplifiedName: string;
  simplifiedVehicles: string[];
  typeKey: string;
}

export interface BrowseWeaponGroup {
  calibre: number;
  entries: BrowseIndexEntry[];
  simplifiedWeapon: string;
  weapon: string;
}

export interface DetailedShell extends ShellsPlaceDataShell {
  weapon: string;
  linkedData: Partial<{
    breadcrumbs: WithContext<BreadcrumbList>;
  }>;
}
