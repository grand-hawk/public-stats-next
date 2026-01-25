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
      <Icon height={5} width={5} {...props}>
        <TbTank />
      </Icon>
    ),
  },
  shells: {
    label: 'Shells',
    path: '/shells',
    color: 'orange.500',
    description:
      'Analyze shell performance, penetration values, and damage characteristics.',
    icon: (props: IconProps) => (
      <Icon height={5} width={5} {...props}>
        <GiArtilleryShell />
      </Icon>
    ),
  },
  teams: {
    label: 'Teams',
    path: '/teams',
    color: 'red.500',
    description: 'Browse faction vehicle selections and compositions by team.',
    icon: (props: IconProps) => (
      <Icon height={5} width={5} {...props}>
        <MdFlag />
      </Icon>
    ),
  },
  loadouts: {
    label: 'Loadouts',
    path: '/loadouts',
    color: 'cyan.500',
    description: 'Explore era-based loadouts and compare team compositions.',
    icon: (props: IconProps) => (
      <Icon height={5} width={5} {...props}>
        <MdViewList />
      </Icon>
    ),
  },
  kdr: {
    label: 'K/D table',
    path: '/kdr',
    color: 'green.500',
    description:
      'View the kill-to-death ratios for all vehicles and shells in the game.',
    icon: (props: IconProps) => (
      <Icon height={5} width={5} {...props}>
        <ImTable />
      </Icon>
    ),
  },
  winrate: {
    label: 'Winrate',
    path: '/winrate',
    color: 'purple.500',
    description:
      'Track team performance across different maps and loadouts over time.',
    icon: (props: IconProps) => (
      <Icon height={5} width={5} {...props}>
        <MdOutlineSsidChart />
      </Icon>
    ),
  },
};
