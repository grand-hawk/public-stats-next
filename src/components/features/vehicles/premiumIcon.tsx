import { Icon } from '@chakra-ui/react';
import React from 'react';
import { IoMdGift } from 'react-icons/io';
import { MdOutlineAttachMoney, MdWorkspacePremium } from 'react-icons/md';

import type { VehiclesPlaceDataVehicleInfo } from '@generated/vehicles';

export type PremiumType = NonNullable<
  VehiclesPlaceDataVehicleInfo['premium']
>['type'];

const premiumConfig: Record<
  PremiumType,
  { color: string; icon: React.ComponentType }
> = {
  coins: { color: 'yellow.400', icon: MdWorkspacePremium },
  money: { color: 'green.400', icon: MdOutlineAttachMoney },
  badge: { color: 'purple.400', icon: IoMdGift },
};

interface PremiumIconProps {
  boxSize?: string;
  premium?: PremiumType;
}

export default function PremiumIcon({
  boxSize = '14px',
  premium,
}: PremiumIconProps) {
  if (!premium) return null;

  const config = premiumConfig[premium];

  return (
    <Icon boxSize={boxSize} color={config.color} flexShrink={0}>
      <config.icon />
    </Icon>
  );
}
