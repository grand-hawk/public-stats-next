import { Box, Span, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import { useDynamicData } from '@/hooks/providers/dynamicData';
import { useVehicle } from '@/hooks/providers/vehicle';
import { getOneModuleOfType } from '@/utils/alterations';
import { getTurretsWithNamesSorted } from '@/utils/turrets';

import type { DynamicDataContext } from '@/hooks/providers/dynamicData';
import type { SectionMarker } from '@/hooks/providers/sectionMarkers';
import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

function computeMarkers(
  vehicle: DetailedVehicle,
  assembledModules: DynamicDataContext['assembledModules'],
  isAvailable: boolean,
): SectionMarker[] {
  const markers: SectionMarker[] = [];
  markers.push({ name: 'General information', slug: 'general-information' });

  if (isAvailable) {
    markers.push({
      name: 'In-game availability',
      slug: 'in-game-availability',
    });
  }

  const driveData = getOneModuleOfType('DriveData', assembledModules);
  const seat = getOneModuleOfType('Seat', assembledModules);
  if (driveData || seat) markers.push({ name: 'Vehicle', slug: 'vehicle' });

  if (driveData) markers.push({ name: 'Powertrain', slug: 'powertrain' });

  if (driveData?.data.metrics) {
    markers.push({ name: 'Performance', slug: 'performance' });
  }

  if (vehicle.info.damageModules) {
    markers.push({ name: 'Armour', slug: 'armour' });
  }

  const essModule = getOneModuleOfType('ESS', assembledModules);
  const ewModule = getOneModuleOfType('EW', assembledModules);
  if (essModule || ewModule) {
    markers.push({ name: 'Defenses', slug: 'defenses' });
  }

  const sortedTurrets = getTurretsWithNamesSorted(assembledModules);
  if (sortedTurrets.length > 0) {
    markers.push({ name: 'Turrets', slug: slug(sortedTurrets[0].name) });
  }

  markers.push({ name: 'Gallery', slug: 'gallery' });

  return markers;
}

export default function SectionNavigation() {
  const vehicle = useVehicle();
  const { assembledModules } = useDynamicData();
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  const isAvailable =
    !!vehicle.info.availability &&
    Object.keys(vehicle.info.availability).length > 0;

  const markers = React.useMemo(
    () => computeMarkers(vehicle, assembledModules, isAvailable),
    [vehicle, assembledModules, isAvailable],
  );

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
    <Stack gap={2} hideBelow="xl" data-md-ignore>
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

          return (
            <Box
              asChild
              key={marker.slug}
              css={{
                display: 'flex',
                alignItems: 'center',
                height: '32px',
                marginInlineStart: '-1px',
                padding: '0 11px',
                borderInlineStartWidth: '2px',
                borderInlineStartStyle: 'solid',
                borderColor: isActive
                  ? 'var(--color-progressive)'
                  : 'transparent',
                borderRadius: '0 4px 4px 0',
                color: isActive ? 'var(--color-progressive)' : 'fg.muted',
                fontSize: '0.875rem',
                fontWeight: 500,
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
