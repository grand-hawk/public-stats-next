import React from 'react';

import EagleTeamIcon from '@/components/icons/teams/eagle';
import FishTeamIcon from '@/components/icons/teams/fish';
import HawkTeamIcon from '@/components/icons/teams/hawk';
import SchwalbenheimKingdomTeamIcon from '@/components/icons/teams/schwalbenheim';

import type { IconProps } from '@chakra-ui/react';

export const teamIcons: Record<string, React.FunctionComponent<IconProps>> = {
  'Eagle Federation': EagleTeamIcon,
  'Fish State': FishTeamIcon,
  'Hawk Republic': HawkTeamIcon,
  'Schwalbenheim Kingdom': SchwalbenheimKingdomTeamIcon,
};

export function renderTeamIcon(team: string) {
  const TeamIcon = teamIcons[team];
  if (!TeamIcon) return null;

  return <TeamIcon size="md" />;
}
