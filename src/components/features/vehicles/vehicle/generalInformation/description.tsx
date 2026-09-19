import { Box, Link, Quote, Span, Text } from '@chakra-ui/react';
import React from 'react';
import Markdown from 'react-markdown';

import { MarkdownAnchor } from '@/components/common/externalLink';
import { inWhere, Prose } from '@/components/ui/prose';
import { useVehicle } from '@/hooks/providers/vehicle';
import { usePlace } from '@/hooks/usePlace';
import { applyWikilinks } from '@/utils/wikilinks';

import type { BoxProps } from '@chakra-ui/react';

const COLLAPSED_MAX_HEIGHT = 150;
const COLLAPSE_THRESHOLD = COLLAPSED_MAX_HEIGHT + 50;

const QUOTE_CSS = {
  borderInlineStartWidth: '2px',
  borderInlineStartStyle: 'solid',
  borderColor: 'border',
  fontFamily: 'var(--font-family-monospace)',
  fontSize: '0.875rem',
  fontWeight: 400,
  lineHeight: '1.375rem',
  paddingInlineStart: '12px',
} as const;

const baseContentProps: BoxProps = {
  color: 'fg',
  id: 'vehicle-page-description',
  whiteSpace: 'pre-wrap',
  'aria-label': 'Description',
};

export default function VehicleDescription() {
  const vehicle = useVehicle();
  const place = usePlace()!;

  const rawDescription = vehicle.content?.Description;
  const customDescription = React.useMemo(() => {
    if (!rawDescription) return undefined;
    return applyWikilinks(rawDescription, place.initials);
  }, [rawDescription, place.initials]);

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [needsExpand, setNeedsExpand] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [skipTransition, setSkipTransition] = React.useState(false);

  React.useEffect(() => {
    if (!contentRef.current) return;
    const height = contentRef.current.scrollHeight;
    setContentHeight(height);
    setNeedsExpand(height > COLLAPSE_THRESHOLD);
  }, [customDescription]);

  React.useEffect(() => {
    setIsExpanded(false);
    setSkipTransition(true);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSkipTransition(false));
    });
    return () => cancelAnimationFrame(id);
  }, [vehicle.info.slug]);

  return (
    <Box>
      <Text
        color="fg.muted"
        css={{
          fontSize: '0.875rem',
          lineHeight: '1.375rem',
          marginBlockEnd: '8px',
        }}
      >
        {customDescription ? 'Description' : 'In-game description'}
      </Text>

      {customDescription ? (
        <div>
          <Box
            ref={contentRef}
            overflow="hidden"
            position="relative"
            css={{
              maxHeight: needsExpand
                ? isExpanded
                  ? `${contentHeight}px`
                  : `${COLLAPSED_MAX_HEIGHT}px`
                : 'none',
              transition: skipTransition ? 'none' : 'max-height 0.3s ease',
            }}
          >
            <Box asChild {...baseContentProps}>
              <Quote asChild>
                <Prose
                  color="fg"
                  data-prose
                  size="md"
                  css={{
                    ...QUOTE_CSS,
                    [inWhere('& h3, h4')]: {
                      marginTop: '0.4em',
                      marginBottom: 0,
                    },
                  }}
                >
                  <Markdown
                    components={{
                      a: ({ children, href }) => (
                        <MarkdownAnchor href={href}>{children}</MarkdownAnchor>
                      ),
                      p: ({ children }) => <Span>{children}</Span>,
                    }}
                  >
                    {customDescription}
                  </Markdown>
                </Prose>
              </Quote>
            </Box>

            {needsExpand && !isExpanded && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height="80px"
                bgGradient="to-t"
                gradientFrom="bg"
                gradientTo="transparent"
                pointerEvents="none"
              />
            )}
          </Box>

          {needsExpand && (
            <Link
              as="button"
              variant="underline"
              fontSize="xs"
              color="fg.muted"
              onClick={() => setIsExpanded((prev) => !prev)}
              marginTop={2}
              alignSelf="start"
              focusRing="none"
            >
              {isExpanded ? 'Collapse...' : 'Expand...'}
            </Link>
          )}
        </div>
      ) : (
        <Box asChild {...baseContentProps} css={QUOTE_CSS}>
          <Quote>{vehicle.info.description}</Quote>
        </Box>
      )}
    </Box>
  );
}
