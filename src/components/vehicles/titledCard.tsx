import { Box, Heading, Link, Separator } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import type { BoxProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function TitledCard({
  children,
  innerPadding = 6,
  title,
  withAnchor,
  ...props
}: PropsWithChildren<
  BoxProps & {
    title: string;
    innerPadding?: BoxProps['padding'];
    withAnchor?: boolean;
  }
>) {
  const titleSlug = withAnchor ? slug(title) : undefined;

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
      </Heading>
      <Separator />
      <Box padding={innerPadding}>{children}</Box>
    </Box>
  );
}
