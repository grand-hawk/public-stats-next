import { Box, Collapsible, Icon } from '@chakra-ui/react';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import slug from 'slug';

import ModuleIdSelect from '@/components/development/moduleIdSelect';
import { ToggleTip } from '@/components/ui/toggle-tip';
import CardCollapseTrigger from '@/components/wiki/cardCollapseTrigger';
import CardHeading, { HEADING_LEVEL_CSS } from '@/components/wiki/cardHeading';
import { useDynamicData } from '@/hooks/providers/dynamicData';

import type { BoxProps, HeadingProps } from '@chakra-ui/react';

const ParentHighlightedContext = React.createContext(false);
export const useParentHighlighted = () =>
  React.useContext(ParentHighlightedContext);

const HEADING_LEVEL_MARGIN: Record<string, string> = {
  h2: '32px',
  h3: '24px',
  h4: '20px',
};

export interface TitledCardProps extends BoxProps {
  title: string;
  withAnchor?: boolean | string;
  moduleId?: string;
  tooltip?: string;
  collapsible?: boolean | 'force';
  closedByDefault?: boolean;
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

  const level = typeof headingAs === 'string' ? headingAs : 'h2';

  React.useLayoutEffect(() => {
    if (!withAnchor || !collapsible) return;

    const expandIfHashMatches = () => {
      if (window.location.hash.slice(1) === titleSlug) {
        setIsExpanded(true);
      }
    };

    expandIfHashMatches();
    window.addEventListener('hashchange', expandIfHashMatches);
    return () => window.removeEventListener('hashchange', expandIfHashMatches);
  }, [withAnchor, collapsible, titleSlug]);

  const header = (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBlockStart: HEADING_LEVEL_MARGIN[level] ?? '32px',
        marginBlockEnd: '12px',
      }}
    >
      <CardHeading
        as={level}
        id={titleSlug}
        title={title}
        withAnchor={withAnchor}
        onAnchorClick={collapsible ? () => setIsExpanded(true) : undefined}
        typography={{
          ...(HEADING_LEVEL_CSS[level] ?? HEADING_LEVEL_CSS.h2),
          fontWeight: 500,
        }}
      />

      {tooltip && (
        <ToggleTip
          closeDelay={50}
          content={tooltip}
          openDelay={50}
          positioning={{ placement: 'top' }}
        >
          <Icon color="fg.muted">
            <MdInfoOutline />
          </Icon>
        </ToggleTip>
      )}

      <ModuleIdSelect moduleId={moduleId} />

      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginInlineStart: 'auto',
        }}
      >
        {endAddon}

        {collapsible && <CardCollapseTrigger expanded={isExpanded} />}
      </Box>
    </Box>
  );

  const content = (
    <Box
      aria-labelledby={titleSlug}
      css={{
        '& .mtc-frame': {
          outline: isHighlighted ? '2px solid' : undefined,
          outlineColor: highlightColor,
          outlineOffset: isHighlighted ? '-2px' : undefined,
          transition: 'outline 0.3s ease-in-out',
        },
      }}
    >
      {isHighlighted ? (
        <ParentHighlightedContext.Provider value={true}>
          {children}
        </ParentHighlightedContext.Provider>
      ) : (
        children
      )}
    </Box>
  );

  return (
    <Box
      className="mtc-titled-card"
      data-module-highlighted={isHighlighted || undefined}
      {...props}
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
