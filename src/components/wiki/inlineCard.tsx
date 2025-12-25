import { Box, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import ModuleIdSelect from '@/components/development/moduleIdSelect';

import type { BoxProps, HeadingProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function InlineCard({
  children,
  headingAs,
  innerPadding = 4,
  moduleId,
  title,
  withAnchor,
  ...props
}: PropsWithChildren<
  {
    title: string;
    withAnchor?: boolean | string;
    innerPadding?: BoxProps['padding'];
    headingAs?: HeadingProps['as'];
    moduleId?: string;
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
        as={headingAs}
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

        <ModuleIdSelect moduleId={moduleId} />
      </Heading>

      <Box aria-labelledby={titleSlug} marginTop={1}>
        {children}
      </Box>
    </Box>
  );
}
