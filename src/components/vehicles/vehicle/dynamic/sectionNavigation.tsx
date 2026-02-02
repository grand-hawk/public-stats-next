import { Button, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import { useDynamicData } from '@/hooks/providers/dynamicData';
import { useVehicle } from '@/hooks/providers/vehicle';
import {
  getAllModulesOfType,
  getOneModuleFromReferences,
  getOneModuleOfType,
} from '@/utils/alterations';

import { getTurretPriorityIndex } from './modules/turrets';

import type { DynamicDataContext } from '@/hooks/providers/dynamicData';
import type { SectionMarker } from '@/hooks/providers/sectionMarkers';

function computeMarkers(
  assembledModules: DynamicDataContext['assembledModules'],
  isAvailable: boolean,
): SectionMarker[] {
  const markers: SectionMarker[] = [];

  // General
  markers.push({ name: 'General information', slug: 'general-information' });

  if (isAvailable)
    markers.push({
      name: 'In-game availability',
      slug: 'in-game-availability',
    });

  // Vehicle section
  const driveData = getOneModuleOfType('DriveData', assembledModules);
  const seat = getOneModuleOfType('Seat', assembledModules);
  if (driveData || seat) markers.push({ name: 'Vehicle', slug: 'vehicle' });

  // Powertrain section
  if (driveData) markers.push({ name: 'Powertrain', slug: 'powertrain' });

  // Defenses section
  const essModule = getOneModuleOfType('ESS', assembledModules);
  const ewModule = getOneModuleOfType('EW', assembledModules);
  if (essModule || ewModule)
    markers.push({ name: 'Defenses', slug: 'defenses' });

  // Turrets section
  const turrets = getAllModulesOfType('Turret', assembledModules);
  if (turrets.length > 0) {
    const turretsWithNames = turrets.map((turret) => {
      let name = 'Turret';
      const control = getOneModuleFromReferences<'Seat'>(
        turret.data.control,
        assembledModules,
      );
      if (control) name = `${control.data.name} turret`;
      return { name, ...turret };
    });

    const sortedTurrets = [...turretsWithNames].sort((a, b) => {
      const aPriority = getTurretPriorityIndex(a.name);
      const bPriority = getTurretPriorityIndex(b.name);
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.name.localeCompare(b.name);
    });

    markers.push({ name: 'Turrets', slug: slug(sortedTurrets[0].name) });
  }

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
    () => computeMarkers(assembledModules, isAvailable),
    [assembledModules, isAvailable],
  );

  React.useEffect(() => {
    if (markers.length === 0) return;

    const hash = window.location.hash.slice(1);
    const matchingMarker = markers.find((m) => m.slug === hash);

    setActiveSlug(matchingMarker ? hash : markers[0].slug);
  }, [markers]);

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
