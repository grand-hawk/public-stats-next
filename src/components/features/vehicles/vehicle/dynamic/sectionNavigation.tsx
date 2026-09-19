import React from 'react';
import slug from 'slug';

import OnThisPage from '@/components/wiki/onThisPage';
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

  const isAvailable =
    !!vehicle.info.availability &&
    Object.keys(vehicle.info.availability).length > 0;

  const markers = React.useMemo(
    () => computeMarkers(vehicle, assembledModules, isAvailable),
    [vehicle, assembledModules, isAvailable],
  );

  return <OnThisPage hideBelow="xl" markers={markers} />;
}
