import { Icon } from '@chakra-ui/react';
import React from 'react';
import { BiBorderNone } from 'react-icons/bi';

import EagleTeamIcon from '@/components/icons/teams/eagle';
import FelidTeamIcon from '@/components/icons/teams/felid';
import FishTeamIcon from '@/components/icons/teams/fish';
import HawkTeamIcon from '@/components/icons/teams/hawk';
import NightingaleTeamIcon from '@/components/icons/teams/nightingale';
import RedtailTeamIcon from '@/components/icons/teams/redtail';
import SchwalbenheimKingdomTeamIcon from '@/components/icons/teams/schwalbenheim';
import SchwalbenheimRepublicTeamIcon from '@/components/icons/teams/schwalbenheimRepublic';

import type { IconProps } from '@chakra-ui/react';

export const teamIcons: Record<string, React.FunctionComponent<IconProps>> = {
  'Eagle Federation': EagleTeamIcon,
  'Eagle Republic': EagleTeamIcon,
  'FISH State': FishTeamIcon,
  'Hawk Republic': HawkTeamIcon,
  'Schwalbenheim Kingdom': SchwalbenheimKingdomTeamIcon,
  'Schwalbenheim Republic': SchwalbenheimRepublicTeamIcon,
  'Felid Empire': FelidTeamIcon,
  'Nightingale Unitary State': NightingaleTeamIcon,
  'Redtail PMC': RedtailTeamIcon,
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
