import {
  Box,
  Collapsible,
  Flex,
  Heading,
  Icon,
  Link,
  Separator,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {
  MdExpandLess,
  MdInfoOutline,
  MdOutlineExpandMore,
} from 'react-icons/md';
import slug from 'slug';

import ModuleIdSelect from '@/components/development/moduleIdSelect';
import { ToggleTip } from '@/components/ui/toggle-tip';
import { useDynamicData } from '@/hooks/providers/dynamicData';

import type { BoxProps, HeadingProps } from '@chakra-ui/react';

export const ParentHighlightedContext = React.createContext(false);
export const useParentHighlighted = () =>
  React.useContext(ParentHighlightedContext);

export interface TitledCardProps extends BoxProps {
  title: string;
  innerPadding?: BoxProps['padding'];
  withAnchor?: boolean | string;
  moduleId?: string;
  tooltip?: string;
  collapsible?: boolean | 'force';
  closedByDefault?: boolean;
  keepBorder?: boolean;
  endAddon?: React.ReactNode;
  headingAs?: HeadingProps['as'];
  children?: React.ReactNode;
}

export default function TitledCard({
  children,
  closedByDefault = false,
  collapsible = false,
  endAddon,
  headingAs,
  innerPadding = 6,
  keepBorder,
  moduleId,
  title,
  tooltip,
  withAnchor,
  ...props
}: TitledCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(!closedByDefault);

  const dynamicData = useDynamicData();
  const addedModuleIds = dynamicData?.addedModuleIds;
  const hasRemovedChildrenIds = dynamicData?.hasRemovedChildrenIds;

  const isAdded = moduleId && addedModuleIds?.has(moduleId);
  const hasRemovedChildren = moduleId && hasRemovedChildrenIds?.has(moduleId);
  const highlightColor = isAdded
    ? 'blue.muted'
    : hasRemovedChildren
      ? 'red.muted'
      : undefined;
  const isHighlighted = !!highlightColor;

  const titleSlug =
    typeof withAnchor === 'string' ? slug(withAnchor) : slug(title);

  const header = (
    <Box
      alignItems="center"
      display="grid"
      gridTemplateColumns="max-content 1fr"
    >
      <Heading
        fontWeight="medium"
        id={titleSlug}
        marginX={3}
        marginY={2}
        scrollMarginTop={4}
        size="sm"
        as={headingAs}
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

        {tooltip && (
          <ToggleTip
            closeDelay={50}
            content={tooltip}
            openDelay={50}
            positioning={{ placement: 'top' }}
          >
            <Icon marginLeft={2}>
              <MdInfoOutline />
            </Icon>
          </ToggleTip>
        )}

        <ModuleIdSelect moduleId={moduleId} />
      </Heading>

      {collapsible && (
        <Collapsible.Trigger
          aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
          display={
            collapsible !== 'force'
              ? 'var(--columns-if-possible-display-trigger)'
              : undefined
          }
          height="100%"
          paddingLeft={1}
        >
          <Flex justifyContent="flex-end">
            <Icon marginX={2}>
              {isExpanded ? <MdExpandLess /> : <MdOutlineExpandMore />}
            </Icon>
          </Flex>
        </Collapsible.Trigger>
      )}

      {endAddon && (
        <Box marginLeft="auto" marginRight={3}>
          {endAddon}
        </Box>
      )}
    </Box>
  );

  const content = (
    <>
      <Separator />

      <Box aria-labelledby={titleSlug} padding={innerPadding}>
        {isHighlighted ? (
          <ParentHighlightedContext.Provider value={true}>
            {children}
          </ParentHighlightedContext.Provider>
        ) : (
          children
        )}
      </Box>
    </>
  );

  return (
    <Box
      backgroundColor="bg.panel"
      borderLeftWidth={
        keepBorder
          ? '1px'
          : {
              base: 0,
              md: '1px',
            }
      }
      borderRightWidth={
        keepBorder
          ? '1px'
          : {
              base: 0,
              md: '1px',
            }
      }
      borderYWidth="1px"
      className="mtc-titled-card"
      data-module-highlighted={isHighlighted || undefined}
      outline={isHighlighted ? '2px solid' : undefined}
      outlineColor={highlightColor}
      outlineOffset={isHighlighted ? '-1px' : undefined}
      {...props}
      css={{
        ...props.css,
        '& .mtc-titled-card': {
          borderLeftWidth: '1px',
          borderRightWidth: '1px',
        },
        transition: 'outline 0.3s ease-in-out',
      }}
    >
      <Collapsible.Root
        open={isExpanded}
        onOpenChange={(details) => setIsExpanded(details.open)}
      >
        {header}

        {collapsible ? (
          <Collapsible.Content>{content}</Collapsible.Content>
        ) : (
          content
        )}
      </Collapsible.Root>
    </Box>
  );
}
