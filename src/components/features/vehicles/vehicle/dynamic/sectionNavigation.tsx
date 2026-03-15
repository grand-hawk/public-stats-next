import { Button, Stack } from '@chakra-ui/react';
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

  // General
  markers.push({ name: 'General information', slug: 'general-information' });

  if (isAvailable) {
    markers.push({
      name: 'In-game availability',
      slug: 'in-game-availability',
    });
  }

  // Vehicle section
  const driveData = getOneModuleOfType('DriveData', assembledModules);
  const seat = getOneModuleOfType('Seat', assembledModules);
  if (driveData || seat) markers.push({ name: 'Vehicle', slug: 'vehicle' });

  // Powertrain section
  if (driveData) markers.push({ name: 'Powertrain', slug: 'powertrain' });

  // Armour section
  if (vehicle.content?.Armour) markers.push({ name: 'Armour', slug: 'armour' });

  // Defenses section
  const essModule = getOneModuleOfType('ESS', assembledModules);
  const ewModule = getOneModuleOfType('EW', assembledModules);
  if (essModule || ewModule) {
    markers.push({ name: 'Defenses', slug: 'defenses' });
  }

  // Turrets section
  const sortedTurrets = getTurretsWithNamesSorted(assembledModules);
  if (sortedTurrets.length > 0) {
    markers.push({ name: 'Turrets', slug: slug(sortedTurrets[0].name) });
  }

  // Gallery
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
    <Stack as="nav" gap={0} hideBelow="xl" data-md-ignore>
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
