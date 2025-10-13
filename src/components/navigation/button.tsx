import React from 'react';

import IconLink from '@/components/buttonIconLink';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { IconButtonProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function NavigationButton({
  active,
  children,
  href,
  ...props
}: PropsWithChildren<IconButtonProps & { href: string; active?: boolean }>) {
  const initials = usePlaceInitials();

  return (
    <IconLink
      _hover={{
        backgroundColor: active ? 'colorPalette.100' : undefined,
      }}
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
