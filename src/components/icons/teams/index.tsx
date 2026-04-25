import { Icon } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';
import { BiBorderNone } from 'react-icons/bi';

import EagleTeamIcon from '@/components/icons/teams/eagle';
import FelidTeamIcon from '@/components/icons/teams/felid';
import FishTeamIcon from '@/components/icons/teams/fish';
import StateOfGazelTeamIcon from '@/components/icons/teams/gazel';
import HawkTeamIcon from '@/components/icons/teams/hawk';
import NightingaleTeamIcon from '@/components/icons/teams/nightingale';
import PigeonTeamIcon from '@/components/icons/teams/pigeon';
import RedtailTeamIcon from '@/components/icons/teams/redtail';
import SchwalbenheimKingdomTeamIcon from '@/components/icons/teams/schwalbenheim';
import SchwalbenheimRepublicTeamIcon from '@/components/icons/teams/schwalbenheimRepublic';
import { MEDIA_PREFIX } from '@/env';

import type { IconProps } from '@chakra-ui/react';

export const teamIcons: Record<
  string,
  React.FunctionComponent<IconProps> | string
> = {
  'Eagle Federation': EagleTeamIcon,
  'Eagle Republic': EagleTeamIcon,
  'FISH State': FishTeamIcon,
  'State of Gazel': StateOfGazelTeamIcon,
  'Hawk Republic': HawkTeamIcon,
  'Schwalbenheim Kingdom': SchwalbenheimKingdomTeamIcon,
  'Schwalbenheim Republic': SchwalbenheimRepublicTeamIcon,
  'Felid Empire': FelidTeamIcon,
  'Nightingale Unitary State': NightingaleTeamIcon,
  'Redtail PMC': RedtailTeamIcon,
  'Pigeon Freedom Movement': PigeonTeamIcon,
  'Celestial Dragon Dynasty': 'celestial-dragon-dynasty.png',
  "Chollima People's Republic": 'chollima-peoples-republic.png',
  'Close Alliance State Union': 'close-alliance-state-union.png',
  'Great Britain': 'great-britain.png',
  'Koltrasten Kingdom': 'koltrasten-kingdom.png',
  'Republic of Chantecler': 'republic-of-chantecler.png',
  'Talitiainen Republic': 'talitiainen-republic.png',
  'The Leonic Commonwealth': 'the-leonic-commonwealth.png',
  'Kingdom of Falconia': 'kingdom-of-falconia.png',
};

export default function TeamIcon({
  size = 5,
  team,
}: {
  team: string;
  size?: IconProps['boxSize'];
}) {
  const TeamIcon = teamIcons[team];

  const iconProps: IconProps = {
    height: size,
    width: size,
    'aria-hidden': true,
    focusable: false,
  };

  if (!TeamIcon) {
    return (
      <Icon {...iconProps}>
        <BiBorderNone />
      </Icon>
    );
  }

  if (typeof TeamIcon === 'string') {
    return (
      <Icon {...iconProps}>
        <NextImage
          src={`${MEDIA_PREFIX}/assets/icons/teams/${TeamIcon}`}
          height={64}
          width={64}
          alt=""
        />
      </Icon>
    );
  }

  return <TeamIcon {...iconProps} />;
}
