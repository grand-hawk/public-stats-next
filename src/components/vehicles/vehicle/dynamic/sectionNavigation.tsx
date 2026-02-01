import { Button, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { useSectionMarkers } from '@/hooks/providers/sectionMarkers';

export default function SectionNavigation() {
  const { activeSlug, markers, setActiveSlug } = useSectionMarkers();

  React.useEffect(() => {
    if (markers.length === 0) return;

    const elements = markers
      .map((marker) => document.getElementById(marker.slug))
      .filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
      },
      { rootMargin: '0px 0px -90% 0px' },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [markers, setActiveSlug]);

  if (markers.length === 0) return null;
  return (
    <Stack as="nav" gap={0}>
      {markers.map((marker) => {
        const isActive = activeSlug === marker.slug;

        return (
          <Button
            asChild
            borderLeftColor={isActive ? 'colorPalette.solid' : 'transparent'}
            borderLeftWidth="2px"
            borderRadius={0}
            fontWeight={isActive ? 'medium' : 'normal'}
            justifyContent="flex-start"
            key={marker.slug}
            size="sm"
            backgroundColor={{
              base: 'bg.panel',
              _hover: 'bg.muted',
            }}
            variant="subtle"
          >
            <NextLink href={`#${marker.slug}`} shallow>
              {marker.name}
            </NextLink>
          </Button>
        );
      })}
    </Stack>
  );
}
