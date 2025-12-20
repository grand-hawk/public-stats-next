import React from 'react';

import IconLink from '@/components/buttonIconLink';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { IconButtonProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function NavigationButton({
  active,
  children,
  color,
  href,
  ...props
}: PropsWithChildren<
  IconButtonProps & { href: string; active?: boolean; color?: string }
>) {
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
