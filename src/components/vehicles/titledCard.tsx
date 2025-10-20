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

import { Tooltip } from '@/components/ui/tooltip';

import type { BoxProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function TitledCard({
  children,
  closedByDefault = false,
  collapsible = false,
  innerPadding = 6,
  keepBorder,
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
    collapsible?: boolean | 'force';
    closedByDefault?: boolean;
    keepBorder?: boolean;
  }
>) {
  const [isExpanded, setIsExp  const titleSlug = typeof withAnchor === 'string' ? slug(withAnchor) : slug(title);chor) : slug(title);
  }, [withAnchor, title]);

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
    </Box>
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
      borderLeftWidth={
        keepBorder
          ? '1px'
          : {
              base: 0,
              md: '1px',
            }
      }
      borderRadius="none"
      borderRightWidth={
        keepBorder
          ? '1px'
          : {
              base: 0,
              md: '1px',
            }
      }
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
