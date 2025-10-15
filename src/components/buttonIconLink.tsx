import { IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { IconButtonProps } from '@chakra-ui/react';
import type { LinkProps } from 'next/link';
import type { PropsWithChildren } from 'react';

export default function IconLink({
  children,
  disabled,
  href,
  linkProps = {},
  ...props
}: PropsWithChildren<
  IconButtonProps & {
    href: string;
    linkProps?: Omit<LinkProps, 'href'> &
      React.AnchorHTMLAttributes<HTMLAnchorElement>;
  }
>) {
  return (
    <IconButton
      asChild
      borderRadius="none"
      disabled={disabled}
      height={10}
      width={10}
      {...props}
    >
      {disabled ? (
        <div aria-hidden>{children}</div>
      ) : (
        <NextLink href={href} {...linkProps}>
          {children}
        </NextLink>
      )}
    </IconButton>
  );
}
