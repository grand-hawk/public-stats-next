import {
  Box,
  Collapsible,
  Heading,
  HStack,
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

import { Tooltip } from '@/components/ui/tooltip';

import type { BoxProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function TitledCard({
  children,
  collapsible = false,
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
    collapsible?: boolean;
  }
>) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const titleSlug = React.useMemo(() => {
    return typeof withAnchor === 'string' ? slug(withAnchor) : slug(title);
  }, [withAnchor, title]);

  const header = (
    <HStack justifyContent="space-between">
      <Heading
        fontWeight="medium"
        id={titleSlug}
        marginX={3}
        marginY={2}
        size="sm"
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

      {collapsible && (
        <Collapsible.Trigger
          display="var(--columns-if-possible-display-trigger)"
          paddingLeft={1}
          paddingY={1}
        >
          <Icon marginX={2}>
            {isExpanded ? <MdExpandLess /> : <MdOutlineExpandMore />}
          </Icon>
        </Collapsible.Trigger>
      )}
    </HStack>
  );

  const content = (
    <>
      <Separator />

      <Box aria-labelledby={titleSlug} padding={innerPadding}>
        {children}
      </Box>
    </>
  );

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
