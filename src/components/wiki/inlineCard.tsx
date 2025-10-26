import { Box, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import type { BoxProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function InlineCard({
  children,
  innerPadding = 4,
  keepBorder,
  title,
  withAnchor,
  ...props
}: PropsWithChildren<
  {
    title: string;
    withAnchor?: boolean | string;
    innerPadding?: BoxProps['padding'];
    keepBorder?: boolean;
  } & BoxProps
>) {
  const titleSlug =
    typeof withAnchor === 'string' ? slug(withAnchor) : slug(title);

  return (
    <Box
      borderLeftWidth="1px"
      borderRadius="none"
      borderRightWidth="1px"
      borderYWidth="1px"
      marginTop={2}
      padding={innerPadding}
      position="relative"
      {...props}
    >
      <Heading
        backgroundColor="currentBg"
        color="fg"
        fontWeight="medium"
        id={titleSlug}
        insetInlineStart={2}
        paddingX={2}
        position="absolute"
        size="sm"
        top={-2.5}
      >
        {withAnchor ? (
          <Link asChild>
            <NextLink href={`#${titleSlug}`} shallow>
              {title}
            </NextLink>
          </Link>
        ) : (
          title
        )}
      </Heading>

      <Box aria-labelledby={titleSlug} marginTop={1}>
        {children}
      </Box>
    </Box>
  );
}
