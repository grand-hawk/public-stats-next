import { Icon } from '@chakra-ui/react';
import React from 'react';
import { BiBorderNone } from 'react-icons/bi';

import EagleTeamIcon from '@/components/icons/teams/eagle';
import FelidTeamIcon from '@/components/icons/teams/felid';
import FishTeamIcon from '@/components/icons/teams/fish';
import HawkTeamIcon from '@/components/icons/teams/hawk';
import NightingaleTeamIcon from '@/components/icons/teams/nightingale';
import SchwalbenheimKingdomTeamIcon from '@/components/icons/teams/schwalbenheim';

import type { IconProps } from '@chakra-ui/react';

export const teamIcons: Record<string, React.FunctionComponent<IconProps>> = {
  'Eagle Federation': EagleTeamIcon,
  'Eagle Republic': EagleTeamIcon,
  'Fish State': FishTeamIcon,
  'Hawk Republic': HawkTeamIcon,
  'Schwalbenheim Kingdom': SchwalbenheimKingdomTeamIcon,
  'Felid Empire': FelidTeamIcon,
  'Nightingale Unitary State': NightingaleTeamIcon,
};

export default function TeamIcon({ team }: { team: string }) {
  const TeamIcon = teamIcons[team];

  const iconProps: IconProps = {
    height: 5,
    width: 5,
    'aria-hidden': true,
    focusable: false,
  };

  return TeamIcon ? (
    <TeamIcon {...iconProps} />
  ) : (
    <Icon {...iconProps}>
      <BiBorderNone />
    </Icon>
  );
}
