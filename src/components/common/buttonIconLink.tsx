import { IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { IconButtonProps } from '@chakra-ui/react';
import type { LinkProps } from 'next/link';

export interface IconLinkProps extends IconButtonProps {
  children: React.ReactNode;
  href: string;
  linkProps?: Omit<LinkProps, 'href'> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

export default function IconLink({
  children,
  disabled,
  href,
  linkProps = {},
  ...props
}: IconLinkProps) {
  return (
    <IconButton
      asChild
      borderRadius="none"
      disabled={disabled}
      height={10}
      minWidth="unset"
      width={10}
      {...props}
    >
      {disabled ? (
        <div aria-hidden>{children}</div>
      ) : (
        <NextLink href={href} prefetch={false} {...linkProps}>
          {children}
        </NextLink>
      )}
    </IconButton>
  );
}
