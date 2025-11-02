import { Icon } from '@chakra-ui/react';
import React from 'react';
import { GiArtilleryShell } from 'react-icons/gi';
import { ImTable } from 'react-icons/im';
import { MdOutlineSsidChart } from 'react-icons/md';
import { TbTank } from 'react-icons/tb';

import type { ReactNode } from 'react';
import type { IconType } from 'react-icons/lib';

export interface Tab {
  label: string;
  path: string;
  icon: IconType | (() => ReactNode);
}

export const tabs: Record<string, Tab> = {
  vehicles: {
    label: 'Vehicles',
    path: '/vehicles',
    icon: () => (
      <Icon height={5} width={5}>
        <TbTank />
      </Icon>
    ),
  },
  shells: {
    label: 'Shells',
    path: '/shells',
    icon: () => (
      <Icon height={5} width={5}>
        <GiArtilleryShell />
      </Icon>
    ),
  },
  kdr: {
    label: 'K/D table',
    path: '/kdr',
    icon: () => (
      <Icon height={5} width={5}>
        <ImTable />
      </Icon>
    ),
  },
  winrate: {
    label: 'Winrate',
    path: '/winrate',
    icon: () => (
      <Icon height={5} width={5}>
        <MdOutlineSsidChart />
      </Icon>
    ),
  },
};
