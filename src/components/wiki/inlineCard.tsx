import { Box } from '@chakra-ui/react';
import React from 'react';
import slug from 'slug';

import ModuleIdSelect from '@/components/development/moduleIdSelect';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import CardHeading from '@/components/wiki/cardHeading';
import { useParentHighlighted } from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';

import type { BoxProps, HeadingProps } from '@chakra-ui/react';

export interface InlineCardProps extends BoxProps {
  children?: React.ReactNode;
  endAddon?: React.ReactNode;
  flush?: boolean;
  headingAs?: HeadingProps['as'];
  moduleId?: string;
  title: string;
  withAnchor?: boolean | string;
}

export default function InlineCard({
  children,
  endAddon,
  flush,
  headingAs,
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

  const level = typeof headingAs === 'string' ? headingAs : 'h4';

  return (
    <Box
      className="mtc-frame"
      data-module-highlighted={isHighlighted || undefined}
      {...props}
      css={{
        ...RAISED_FRAME_CSS,
        overflow: 'hidden',
        ...props.css,
        outline: isHighlighted ? '2px solid' : undefined,
        outlineColor: isHighlighted ? highlightColor : undefined,
        outlineOffset: isHighlighted ? '-2px' : undefined,
        transition: 'outline 0.3s ease-in-out',
      }}
    >
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-surface-2)',
          borderBlockEndWidth: '1px',
          borderBlockEndStyle: 'solid',
          borderColor: 'var(--border-color-base)',
          padding: '10px 16px',
        }}
      >
        <CardHeading
          as={level}
          id={titleSlug}
          title={title}
          withAnchor={withAnchor}
          typography={{
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: '1.375rem',
          }}
        />

        <ModuleIdSelect moduleId={moduleId} />

        {endAddon && (
          <Box
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginInlineStart: 'auto',
            }}
          >
            {endAddon}
          </Box>
        )}
      </Box>

      <Box aria-labelledby={titleSlug} padding={flush ? 0 : '16px'}>
        {children}
      </Box>
    </Box>
  );
}
