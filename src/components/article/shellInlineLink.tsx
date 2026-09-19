import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

const ICON_SIZE = 16;

export default function ShellInlineLink({
  basePath = '/shells',
  children,
  displayType,
  slug,
}: {
  basePath?: string;
  children: React.ReactNode;
  displayType: string;
  slug: string;
}) {
  const initials = usePlaceInitials();
  const icon = getShellIcon(displayType);

  return (
    <Box
      asChild
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        verticalAlign: 'bottom',
        whiteSpace: 'nowrap',
      }}
    >
      <NextLink href={`/${initials}${basePath}/${slug}`} prefetch={false}>
        {icon && (
          <ShellIcon
            alt=""
            css={{
              flex: 'none',
              width: `${ICON_SIZE}px`,
              height: `${ICON_SIZE}px`,
            }}
            size={ICON_SIZE}
            src={icon}
          />
        )}
        <span>{children}</span>
      </NextLink>
    </Box>
  );
}
