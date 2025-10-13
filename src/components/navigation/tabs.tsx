import { Icon } from '@chakra-ui/react';
import React from 'react';
// import { GiArtilleryShell } from 'react-icons/gi';
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
  // shells: {
  //   label: 'Shells',
  //   path: '/shells',
  //   icon: () => (
  //     <Icon height={5} width={5}>
  //       <GiArtilleryShell />
  //     </Icon>
  //   ),
  // },
};
