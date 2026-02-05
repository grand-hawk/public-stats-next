import React from 'react';

import IconLink from '@/components/common/buttonIconLink';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { IconButtonProps } from '@chakra-ui/react';

export interface NavigationButtonProps extends IconButtonProps {
  active?: boolean;
  children: React.ReactNode;
  color?: string;
  href: string;
}

export default function NavigationButton({
  active,
  children,
  color,
  href,
  ...props
}: NavigationButtonProps) {
  const initials = usePlaceInitials()!;

  return (
    <IconLink
      _hover={
        !active
          ? {
              color,
              backgroundColor: 'transparent',
            }
          : undefined
      }
      backgroundColor={active ? 'colorPalette.100' : undefined}
      height={10}
      href={`/${initials}${href}`}
      variant={active ? 'solid' : 'outline'}
      width={10}
      {...props}
    >
      {children}
    </IconLink>
  );
}
