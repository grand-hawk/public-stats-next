import { GiArtilleryShell } from 'react-icons/gi';
import { LuShield, LuTarget } from 'react-icons/lu';
import { TbHelicopter, TbTank, TbTruck } from 'react-icons/tb';

import type { IconType } from 'react-icons/lib';

export interface VehicleClassCategory {
  slug: string;
  name: string;
  label: string;
  accent: string;
  description: string;
  image?: string;
  fallbackIcon?: IconType;
}

export const VEHICLE_CLASS_CATEGORIES: VehicleClassCategory[] = [
  {
    slug: 'light',
    name: 'Light',
    label: 'Light',
    accent: 'blue',
    description: 'Recon, IFVs, tankettes and fast-moving light tanks.',
    image: '/assets/classes/thumbnails/light.png',
    fallbackIcon: LuTarget,
  },
  {
    slug: 'medium',
    name: 'Medium',
    label: 'Medium',
    accent: 'teal',
    description: 'Medium tanks, MBTs and hybrid combat vehicles.',
    image: '/assets/classes/thumbnails/medium.png',
    fallbackIcon: TbTank,
  },
  {
    slug: 'heavy',
    name: 'Heavy',
    label: 'Heavy',
    accent: 'red',
    description: 'Heavy tanks, breakthrough and prototype MBTs.',
    image: '/assets/classes/thumbnails/heavy.png',
    fallbackIcon: LuShield,
  },
  {
    slug: 'artillery',
    name: 'Artillery',
    label: 'Artillery',
    accent: 'orange',
    description: 'SPGs, tank destroyers, SPAA and assault guns.',
    fallbackIcon: GiArtilleryShell,
  },
  {
    slug: 'aircraft',
    name: 'Aircraft',
    label: 'Aircraft',
    accent: 'cyan',
    description: 'Utility, attack and gunship helicopters.',
    image: '/assets/classes/thumbnails/aircraft.png',
    fallbackIcon: TbHelicopter,
  },
  {
    slug: 'transport',
    name: 'Transport',
    label: 'Transport',
    accent: 'yellow',
    description: 'APCs, trucks, utility and amphibious vehicles.',
    image: '/assets/classes/thumbnails/transport.png',
    fallbackIcon: TbTruck,
  },
];

export function findVehicleClassCategory(slug: string) {
  return VEHICLE_CLASS_CATEGORIES.find((c) => c.slug === slug);
}
