import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import {
  getAllModulesOfType,
  getModulesByReferences,
  getOneModuleFromReferences,
  getOneModuleOfType,
} from '@/utils/alterations';
import { capitalizeFirst } from '@/utils/capitalizeFirst';

import type { SectionDef, StatDef } from '@/components/features/compare/types';
import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type { assembleModules } from '@/utils/alterations';

export interface AssembledVehicle {
  vehicle: DetailedVehicle;
  modules: ReturnType<typeof assembleModules>;
  enabledAlterations: Record<string, boolean>;
}

function stat(
  label: string,
  getter: (a: AssembledVehicle) => React.ReactNode,
): StatDef<AssembledVehicle> {
  return { label, getter };
}

export function buildVehicleSections(): SectionDef<AssembledVehicle>[] {
  return [
    {
      title: 'General',
      stats: [
        stat('Team', (a) => a.vehicle.info.team),
        stat('Role', (a) => a.vehicle.info.role),
        stat('Locomotion', (a) => capitalizeFirst(a.vehicle.info.locomotion)),
        stat('Amphibious', (a) => (a.vehicle.info.amphibious ? 'Yes' : 'No')),
        stat('Classes', (a) =>
          a.vehicle.info.supportedClasses.length > 0
            ? a.vehicle.info.supportedClasses.join(', ')
            : '—',
        ),
        stat('Obtainment', (a) => {
          const isAvailable =
            !!a.vehicle.info.availability &&
            Object.keys(a.vehicle.info.availability).length > 0;
          if (!isAvailable) return 'Dev-spawner only';
          if (!a.vehicle.info.premium) return 'Free';
          if (a.vehicle.info.premium.type === 'coins') return 'Premium';
          if (a.vehicle.info.premium.type === 'money') return 'Shop';
          return 'Badge';
        }),
      ],
    },
    {
      title: 'Vehicle',
      stats: [
        stat('Weight', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return (
            <>
              <FormatNumber maximumFractionDigits={1} value={drive.data.mass} />{' '}
              t
            </>
          );
        }),
        stat('Seats', (a) => {
          const seats = getAllModulesOfType('Seat', a.modules);
          return seats.length > 0 ? <FormatNumber value={seats.length} /> : '—';
        }),
        stat('Forward speed', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return (
            <FormatNumber
              style="unit"
              unit="kilometer-per-hour"
              value={drive.data.engine.forwardSpeed}
            />
          );
        }),
        stat('Reverse speed', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return (
            <FormatNumber
              style="unit"
              unit="kilometer-per-hour"
              value={drive.data.engine.reverseSpeed}
            />
          );
        }),
        stat('Amphibious speed', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive?.data.engine.amphibiousSpeed) return '—';
          return (
            <FormatNumber
              style="unit"
              unit="kilometer-per-hour"
              value={drive.data.engine.amphibiousSpeed}
            />
          );
        }),
      ],
    },
    {
      title: 'Powertrain',
      stats: [
        stat('Engine', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return drive.data.engine.name;
        }),
        stat('Horsepower', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return (
            <>
              <FormatNumber value={drive.data.engine.horsepower} /> hp
            </>
          );
        }),
        stat('Max RPM', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return (
            <>
              <FormatNumber value={drive.data.engine.maxRPM} /> RPM
            </>
          );
        }),
        stat('Power-to-weight', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return (
            <>
              <FormatNumber
                maximumFractionDigits={1}
                value={drive.data.engine.horsepower / drive.data.mass}
              />{' '}
              hp/t
            </>
          );
        }),
        stat('Forward gears', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return drive.data.transmission.forwardGears;
        }),
        stat('Reverse gears', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return drive.data.transmission.reverseGears;
        }),
        stat('Neutral steering', (a) => {
          const drive = getOneModuleOfType('DriveData', a.modules);
          if (!drive) return '—';
          return drive.data.transmission.neutralSteering ? 'Yes' : 'No';
        }),
      ],
    },
    {
      title: 'Turrets',
      stats: [
        stat('Count', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          return turrets.length > 0 ? (
            <FormatNumber value={turrets.length} />
          ) : (
            '—'
          );
        }),
        stat('Stabilizer', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          return turrets.some((t) => t.data.stabilizer) ? 'Yes' : 'No';
        }),
        stat('LWS', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          return turrets.some((t) => t.data.lws) ? 'Yes' : 'No';
        }),
        stat('MAWS', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          return turrets.some((t) => t.data.maws) ? 'Yes' : 'No';
        }),
        stat('Horizontal speed', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          const primary = turrets[0];
          if (!primary) return '—';
          if (primary.data.traverse.speed.horizontal === 0) return 'Fixed';
          return (
            <FormatNumber
              style="unit"
              unit="degree-per-second"
              value={primary.data.traverse.speed.horizontal}
            />
          );
        }),
        stat('Vertical speed', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          const primary = turrets[0];
          if (!primary) return '—';
          if (primary.data.traverse.speed.vertical === 0) return 'Fixed';
          return (
            <FormatNumber
              style="unit"
              unit="degree-per-second"
              value={primary.data.traverse.speed.vertical}
            />
          );
        }),
      ],
    },
    {
      title: 'Main weapon',
      stats: [
        stat('Name', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          const primary = turrets[0];
          if (!primary) return '—';
          const weapons = getModulesByReferences<'Weapon'>(
            primary.data.weapons,
            a.modules,
          ).filter(
            (w) => w.data.name !== 'Smoke Grenade' && w.data.name !== 'Flares',
          );
          if (weapons.length === 0) return '—';
          return weapons[0].data.name;
        }),
        stat('Reload speed', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          const primary = turrets[0];
          if (!primary) return '—';
          const weapons = getModulesByReferences<'Weapon'>(
            primary.data.weapons,
            a.modules,
          ).filter(
            (w) => w.data.name !== 'Smoke Grenade' && w.data.name !== 'Flares',
          );
          if (weapons.length === 0) return '—';
          return (
            <FormatNumber
              style="unit"
              unit="second"
              unitDisplay="narrow"
              value={weapons[0].data.reloadSpeed}
            />
          );
        }),
        stat('Magazine size', (a) => {
          const turrets = getAllModulesOfType('Turret', a.modules);
          const primary = turrets[0];
          if (!primary) return '—';
          const weapons = getModulesByReferences<'Weapon'>(
            primary.data.weapons,
            a.modules,
          ).filter(
            (w) => w.data.name !== 'Smoke Grenade' && w.data.name !== 'Flares',
          );
          if (weapons.length === 0) return '—';
          const magazine = getOneModuleFromReferences<'Magazine'>(
            weapons[0].data.magazine,
            a.modules,
          );
          return magazine ? <FormatNumber value={magazine.data.size} /> : '—';
        }),
      ],
    },
    {
      title: 'Defenses',
      stats: [
        stat('Engine smoke', (a) => {
          const ess = getOneModuleOfType('ESS', a.modules);
          return ess?.data.present ? 'Yes' : 'No';
        }),
        stat('IED jammer', (a) => {
          const ew = getOneModuleOfType('EW', a.modules);
          return ew?.data.ied ? 'Yes' : 'No';
        }),
        stat('Drone jammer', (a) => {
          const ew = getOneModuleOfType('EW', a.modules);
          return ew?.data.drone ? 'Yes' : 'No';
        }),
        stat('APS', (a) => {
          const apsModules = getAllModulesOfType('APS', a.modules);
          return apsModules.length > 0 ? 'Yes' : 'No';
        }),
      ],
    },
  ];
}
