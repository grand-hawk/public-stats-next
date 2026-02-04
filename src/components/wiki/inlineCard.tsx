import { Box, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import ModuleIdSelect from '@/components/development/moduleIdSelect';
import { useParentHighlighted } from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';

import type { BoxProps, HeadingProps } from '@chakra-ui/react';

export interface InlineCardProps extends BoxProps {
  children?: React.ReactNode;
  headingAs?: HeadingProps['as'];
  innerPadding?: BoxProps['padding'];
  moduleId?: string;
  title: string;
  withAnchor?: boolean | string;
}

export default function InlineCard({
  children,
  headingAs,
  innerPadding = 4,
  moduleId,
  title,
  withAnchor,
  ...props
}: InlineCardProps) {
  const titleSlug =
    typeof withAnchor === 'string' ? slug(withAnchor) : slug(title);

  const dynamicData = useDynamicData();
  const addedModuleIds = dynamicData?.addedModuleIds;
  const hasRemovedChildrenIds = dynamicData?.hasRemovedChildrenIds;
  const parentHighlighted = useParentHighlighted();

  const isAdded = moduleId && addedModuleIds?.has(moduleId);
  const hasRemovedChildren = moduleId && hasRemovedChildrenIds?.has(moduleId);
  const highlightColor = isAdded
    ? 'blue.muted'
    : hasRemovedChildren
      ? 'red.muted'
      : undefined;
  const isHighlighted = !parentHighlighted && !!highlightColor;

  return (
    <Box
      borderLeftWidth="1px"
      borderRadius="none"
      borderRightWidth="1px"
      borderYWidth="1px"
      marginTop={2}
      padding={innerPadding}
      position="relative"
      data-module-highlighted={isHighlighted || undefined}
      outline={isHighlighted ? '2px solid' : undefined}
      outlineColor={isHighlighted ? highlightColor : undefined}
      outlineOffset={isHighlighted ? '-1px' : undefined}
      {...props}
      css={{
        ...props.css,
        transition: 'outline 0.3s ease-in-out',
      }}
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
