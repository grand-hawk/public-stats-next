import { Box, Heading, Icon, Link, Separator } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import slug from 'slug';

import { Tooltip } from '@/components/ui/tooltip';

import type { BoxProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function TitledCard({
  children,
  innerPadding = 6,
  title,
  tooltip,
  withAnchor,
  ...props
}: PropsWithChildren<
  BoxProps & {
    title: string;
    innerPadding?: BoxProps['padding'];
    withAnchor?: boolean | string;
    tooltip?: string;
  }
>) {
  const titleSlug = withAnchor
    ? typeof withAnchor === 'string'
      ? slug(withAnchor)
      : slug(title)
    : undefined;

  return (
    <Box
      backgroundColor="bg.panel"
      borderLeftWidth={{
        base: 0,
        md: '1px',
      }}
      borderRadius="none"
      borderRightWidth={{
        base: 0,
        md: '1px',
      }}
      borderYWidth="1px"
      {...props}
    >
      <Heading
        fontWeight="medium"
        id={titleSlug}
        marginX={3}
        marginY={2}
        size="sm"
      >
        {titleSlug ? (
          <Link asChild>
            <NextLink href={`#${titleSlug}`} shallow>
              {title}
            </NextLink>
          </Link>
        ) : (
          title
        )}

        {tooltip && (
          <Tooltip
            closeDelay={50}
            content={tooltip}
            openDelay={50}
            positioning={{ placement: 'top' }}
          >
            <Icon marginLeft={2}>
              <MdInfoOutline />
            </Icon>
          </Tooltip>
        )}
      </Heading>

      <Separator />

      <Box aria-labelledby={titleSlug} padding={innerPadding}>
        {children}
      </Box>
    </Box>
  );
}
