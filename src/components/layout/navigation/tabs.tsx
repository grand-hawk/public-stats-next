import { Icon } from '@chakra-ui/react';
import React from 'react';
import { FaDiscord } from 'react-icons/fa6';
import { GiArtilleryShell } from 'react-icons/gi';
import { ImTable } from 'react-icons/im';
import {
  LuGitCompareArrows,
  LuGithub,
  LuGlobe,
  LuHammer,
  LuScale,
  LuShield,
} from 'react-icons/lu';
import {
  MdAccountTree,
  MdFlag,
  MdNewReleases,
  MdOutlineSsidChart,
  MdViewList,
} from 'react-icons/md';
import { TbTank } from 'react-icons/tb';

import InfantryIcon from '@/components/icons/classes/infantry';

import type { IconProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons/lib';

export interface Tab {
  label: string;
  longLabel?: string;
  path: string;
  color: string;
  description: string;
  icon: IconType | ((props: IconProps) => ReactNode);
  prefetch?: true;
}

export const tabs: Record<string, Tab> = {
  vehicles: {
    label: 'Vehicles',
    path: '/vehicles',
    color: 'blue.500',
    description:
      'Explore the detailed characteristics of all vehicles in the game.',
    icon: (props: IconProps) => (
      <Icon as={TbTank} height={5} width={5} {...props} />
    ),
    prefetch: true,
  },
  shells: {
    label: 'Shells',
    path: '/shells',
    color: 'orange.500',
    description:
      'View shell performance, penetration values, and damage characteristics.',
    icon: (props: IconProps) => (
      <Icon as={GiArtilleryShell} height={5} width={5} {...props} />
    ),
  },
  infantryWeapons: {
    label: 'Infantry weapons',
    path: '/weapons',
    color: 'orange.500',
    description:
      'Penetration, damage and availability of every rifle, machine gun and launcher.',
    icon: (props: IconProps) => (
      <InfantryIcon height={5} width={5} {...props} />
    ),
  },
  placeables: {
    label: 'Placeables',
    path: '/placeables',
    color: 'orange.500',
    description:
      'Emplacements, vehicle armour, structures and explosives you put down yourself.',
    icon: (props: IconProps) => (
      <Icon as={LuHammer} height={5} width={5} {...props} />
    ),
  },
  vehicleFamilies: {
    label: 'Families',
    longLabel: 'Vehicle families',
    path: '/vehicles/families',
    color: 'blue.500',
    description: 'Every design line in the game and the vehicles in it.',
    icon: (props: IconProps) => (
      <Icon as={MdAccountTree} height={5} width={5} {...props} />
    ),
  },
  teams: {
    label: 'Teams',
    path: '/teams',
    color: 'red.500',
    description: 'Browse faction vehicle selections and compositions by team.',
    icon: (props: IconProps) => (
      <Icon as={MdFlag} height={5} width={5} {...props} />
    ),
  },
  loadouts: {
    label: 'Loadouts',
    path: '/loadouts',
    color: 'cyan.500',
    description: 'Explore era-based loadouts and compare team compositions.',
    icon: (props: IconProps) => (
      <Icon as={MdViewList} height={5} width={5} {...props} />
    ),
  },
  kdr: {
    label: 'K/D table',
    path: '/kdr',
    color: 'green.500',
    description: 'View the kill-to-death ratios for all vehicles in the game.',
    icon: (props: IconProps) => (
      <Icon as={ImTable} height={5} width={5} {...props} />
    ),
  },
  winrate: {
    label: 'Winrate',
    path: '/winrate',
    color: 'purple.500',
    description:
      'Track team performance across different maps and loadouts over time.',
    icon: (props: IconProps) => (
      <Icon as={MdOutlineSsidChart} height={5} width={5} {...props} />
    ),
  },
  compare: {
    label: 'Compare',
    path: '/compare',
    color: 'yellow.500',
    description:
      'Compare stats and characteristics of multiple vehicles or shells side by side.',
    icon: (props: IconProps) => (
      <Icon as={LuGitCompareArrows} height={5} width={5} {...props} />
    ),
  },
  updates: {
    label: 'Updates',
    path: '/updates',
    color: 'pink.500',
    description: 'What changed in each game update.',
    icon: (props: IconProps) => (
      <Icon as={MdNewReleases} height={5} width={5} {...props} />
    ),
  },
  armour: {
    label: 'Armour',
    longLabel: 'Armour visualizer',
    path: '/armor',
    color: 'teal.500',
    description:
      'Visualize vehicle armour thickness with customizable color maps.',
    icon: (props: IconProps) => (
      <Icon as={LuShield} height={5} width={5} {...props} />
    ),
  },
};

export const primaryTabKeys = [
  'vehicles',
  'shells',
  'infantryWeapons',
  'placeables',
  'teams',
] as const satisfies (keyof typeof tabs)[];
export const secondaryTabKeys = [
  'kdr',
  'winrate',
] as const satisfies (keyof typeof tabs)[];
export const otherTabKeys = [
  'updates',
] as const satisfies (keyof typeof tabs)[];
export const toolsTabKeys = [
  'compare',
  'armour',
] as const satisfies (keyof typeof tabs)[];

export const indexableTabKeys = [
  ...primaryTabKeys,
  ...secondaryTabKeys,
  ...toolsTabKeys,
  ...otherTabKeys,
] as const satisfies (keyof typeof tabs)[];

export type TabKey = keyof typeof tabs;

export interface ExternalLink {
  label: string;
  href: string;
  icon: IconType;
}

export const externalLinks = {
  discord: {
    label: 'Discord',
    href: 'https://discord.gg/multicrew',
    icon: FaDiscord,
  },
  multicrew: {
    label: 'multicrew.dev',
    href: 'https://www.multicrew.dev',
    icon: LuGlobe,
  },
  github: {
    label: 'GitHub',
    href: 'https://github.com/grand-hawk/public-stats-next',
    icon: LuGithub,
  },
  license: {
    label: 'CC BY-NC 4.0',
    href: 'https://creativecommons.org/licenses/by-nc/4.0/deed',
    icon: LuScale,
  },
} satisfies Record<string, ExternalLink>;

export type MenuEntry =
  { type: 'tab'; key: TabKey } | { type: 'external'; link: ExternalLink };

export interface MenuGroup {
  label: string;
  entries: MenuEntry[];
}

export const menuGroups: MenuGroup[] = [
  {
    label: 'Browse',
    entries: [
      { type: 'tab', key: 'vehicles' },
      { type: 'tab', key: 'teams' },
      { type: 'tab', key: 'shells' },
      { type: 'tab', key: 'infantryWeapons' },
      { type: 'tab', key: 'placeables' },
    ],
  },
  {
    label: 'Game',
    entries: [
      {
        type: 'tab',
        key: 'updates',
      },
    ],
  },
  {
    label: 'Statistics',
    entries: [
      { type: 'tab', key: 'kdr' },
      { type: 'tab', key: 'winrate' },
    ],
  },
  {
    label: 'Tools',
    entries: [
      { type: 'tab', key: 'compare' },
      { type: 'tab', key: 'armour' },
    ],
  },
];
