import { Icon } from '@chakra-ui/react';
import React from 'react';
import { GiArtilleryShell } from 'react-icons/gi';
import { ImTable } from 'react-icons/im';
import { MdFlag, MdOutlineSsidChart, MdViewList } from 'react-icons/md';
import { TbTank } from 'react-icons/tb';

import type { IconProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons/lib';

export interface Tab {
  label: string;
  path: string;
  icon: IconType | ((props: IconProps) => ReactNode);
  color: string;
  description: string;
}

export const tabs: Record<string, Tab> = {
  vehicles: {
    label: 'Vehicles',
    path: '/vehicles',
    color: 'blue.500',
    description:
      'Explore the detailed characteristics and loadouts of all vehicles in the game.',
    icon: (props: IconProps) => (
      <Icon as={TbTank} height={5} width={5} {...props} />
    ),
  },
  shells: {
    label: 'Shells',
    path: '/shells',
    color: 'orange.500',
    description:
      'Analyze shell performance, penetration values, and damage characteristics.',
    icon: (props: IconProps) => (
      <Icon as={GiArtilleryShell} height={5} width={5} {...props} />
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
    description:
      'View the kill-to-death ratios for all vehicles and shells in the game.',
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
};

export const primaryTabKeys = [
  'vehicles',
  'shells',
  'teams',
  'loadouts',
] as const satisfies (keyof typeof tabs)[];
export const secondaryTabKeys = [
  'kdr',
  'winrate',
] as const satisfies (keyof typeof tabs)[];
