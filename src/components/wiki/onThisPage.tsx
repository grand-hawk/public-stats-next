import { Box, Span, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { StackProps } from '@chakra-ui/react';

export interface PageMarker {
  name: string;
  slug: string;
  depth?: number;
}

interface OnThisPageProps extends Omit<StackProps, 'children'> {
  markers: PageMarker[];
}

export default function OnThisPage({ markers, ...props }: OnThisPageProps) {
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (markers.length === 0) return;

    const isCurrentSlugValid =
      activeSlug && markers.some((m) => m.slug === activeSlug);
    if (isCurrentSlugValid) return;

    const hash = window.location.hash.slice(1);
    const matchingMarker = markers.find((m) => m.slug === hash);

    setActiveSlug(matchingMarker ? hash : markers[0].slug);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  React.useEffect(() => {
    if (markers.length === 0) return;

    const elements = markers
      .map((marker) => document.getElementById(marker.slug))
      .filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -90% 0px' },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [markers]);

  if (markers.length === 0) return null;
  return (
    <Stack gap={2} data-md-ignore {...props}>
      <Span
        color="fg.muted"
        css={{ fontSize: '0.875rem', lineHeight: '1.375rem' }}
      >
        On this page
      </Span>

      <Stack
        as="nav"
        gap={0}
        css={{
          borderInlineStartWidth: '1px',
          borderInlineStartStyle: 'solid',
          borderColor: 'var(--border-color-subtle)',
        }}
      >
        {markers.map((marker) => {
          const isActive = activeSlug === marker.slug;
          const isNested = (marker.depth ?? 2) > 2;

          return (
            <Box
              asChild
              key={marker.slug}
              css={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '32px',
                marginInlineStart: '-1px',
                padding: isNested ? '4px 11px 4px 23px' : '4px 11px',
                borderInlineStartWidth: '2px',
                borderInlineStartStyle: 'solid',
                borderColor: isActive
                  ? 'var(--color-progressive)'
                  : 'transparent',
                borderRadius: '0 4px 4px 0',
                color: isActive ? 'var(--color-progressive)' : 'fg.muted',
                fontSize: isNested ? '0.8125rem' : '0.875rem',
                fontWeight: isNested ? 400 : 500,
                lineHeight: '1.375rem',
                textDecoration: 'none',
                '&:hover': { backgroundColor: 'quiet.hover' },
              }}
            >
              <NextLink href={`#${marker.slug}`} shallow>
                {marker.name}
              </NextLink>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
