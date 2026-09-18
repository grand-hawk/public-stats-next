import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import {
  getAllModulesOfType,
  getModulesByReferences,
  getOneModuleFromReferences,
  getOneModuleOfType,
} from '@/utils/alterations';
import { capitalizeFirst } from '@/utils/capitalizeFirst';
import { getTurretsWithNamesSorted } from '@/utils/turrets';

import type { SectionDef, StatDef } from '@/components/features/compare/types';
import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type { assembleModules } from '@/utils/alterations';

export interface AssembledVehicle {
  vehicle: DetailedVehicle;
  modules: ReturnType<typeof assembleModules>;
  enabledAlterations: Record<string, boolean>;
  onAlterationsChange: (alterations: Record<string, boolean>) => void;
}

type Drive = NonNullable<ReturnType<typeof getDrive>>['data'];
type Turret = NonNullable<ReturnType<typeof getPrimaryTurret>>['data'];
type Turrets = ReturnType<typeof getAllModulesOfType<'Turret'>>;
type Weapon = NonNullable<ReturnType<typeof getPrimaryWeapon>>['data'];

function getDrive(a: AssembledVehicle) {
  return getOneModuleOfType('DriveData', a.modules);
}

function getPrimaryTurret(a: AssembledVehicle) {
  const sorted = getTurretsWithNamesSorted(a.modules);
  return sorted[0] ?? null;
}

function getPrimaryWeapon(a: AssembledVehicle) {
  const turret = getPrimaryTurret(a);
  if (!turret) return null;

  const weapons = getModulesByReferences<'Weapon'>(
    turret.data.weapons,
    a.modules,
  ).filter((w) => w.data.name !== 'Smoke Grenade' && w.data.name !== 'Flares');

  return weapons[0] ?? null;
}

function stat(
  label: string,
  getter: (a: AssembledVehicle) => React.ReactNode,
): StatDef<AssembledVehicle> {
  return { label, getter };
}

function driveStat(label: string, getter: (drive: Drive) => React.ReactNode) {
  return stat(label, (a) => {
    const drive = getDrive(a);
    return drive ? getter(drive.data) : '—';
  });
}

function turretsStat(
  label: string,
  getter: (turrets: Turrets) => React.ReactNode,
) {
  return stat(label, (a) => getter(getAllModulesOfType('Turret', a.modules)));
}

function primaryTurretStat(
  label: string,
  getter: (turret: Turret) => React.ReactNode,
) {
  return stat(label, (a) => {
    const turret = getPrimaryTurret(a);
    return turret ? getter(turret.data) : '—';
  });
}

function weaponStat(
  label: string,
  getter: (weapon: Weapon, a: AssembledVehicle) => React.ReactNode,
) {
  return stat(label, (a) => {
    const weapon = getPrimaryWeapon(a);
    return weapon ? getter(weapon.data, a) : '—';
  });
}

function speed(value: number) {
  return <FormatNumber style="unit" unit="kilometer-per-hour" value={value} />;
}

function traverseSpeed(value: number) {
  if (value === 0) return 'Fixed';
  return <FormatNumber style="unit" unit="degree-per-second" value={value} />;
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
        driveStat('Weight', (drive) => (
          <>
            <FormatNumber maximumFractionDigits={1} value={drive.mass} /> t
          </>
        )),
        stat('Seats', (a) => {
          const seats = getAllModulesOfType('Seat', a.modules);
          return seats.length > 0 ? <FormatNumber value={seats.length} /> : '—';
        }),
        driveStat('Forward speed', (drive) => speed(drive.engine.forwardSpeed)),
        driveStat('Reverse speed', (drive) => speed(drive.engine.reverseSpeed)),
        driveStat('Amphibious speed', (drive) =>
          drive.engine.amphibiousSpeed
            ? speed(drive.engine.amphibiousSpeed)
            : '—',
        ),
      ],
    },
    {
      title: 'Powertrain',
      stats: [
        driveStat('Engine', (drive) => drive.engine.name),
        driveStat('Horsepower', (drive) => (
          <>
            <FormatNumber value={drive.engine.horsepower} /> PS
          </>
        )),
        driveStat('Max RPM', (drive) => (
          <>
            <FormatNumber value={drive.engine.maxRPM} /> RPM
          </>
        )),
        driveStat('Power-to-weight', (drive) => (
          <>
            <FormatNumber
              maximumFractionDigits={1}
              value={drive.engine.horsepower / drive.mass}
            />{' '}
            PS/t
          </>
        )),
        driveStat('Forward gears', (drive) => drive.transmission.forwardGears),
        driveStat('Reverse gears', (drive) => drive.transmission.reverseGears),
        driveStat('Neutral steering', (drive) =>
          drive.transmission.neutralSteering ? 'Yes' : 'No',
        ),
      ],
    },
    {
      title: 'Turrets',
      stats: [
        turretsStat('Count', (turrets) =>
          turrets.length > 0 ? <FormatNumber value={turrets.length} /> : '—',
        ),
        turretsStat('Stabilizer', (turrets) =>
          turrets.some((t) => t.data.stabilizer) ? 'Yes' : 'No',
        ),
        turretsStat('LWS', (turrets) =>
          turrets.some((t) => t.data.lws) ? 'Yes' : 'No',
        ),
        turretsStat('MAWS', (turrets) =>
          turrets.some((t) => t.data.maws) ? 'Yes' : 'No',
        ),
        primaryTurretStat('Horizontal speed', (turret) =>
          traverseSpeed(turret.traverse.speed.horizontal),
        ),
        primaryTurretStat('Vertical speed', (turret) =>
          traverseSpeed(turret.traverse.speed.vertical),
        ),
      ],
    },
    {
      title: 'Main weapon',
      stats: [
        weaponStat('Name', (weapon) => weapon.name ?? '—'),
        weaponStat('Reload speed', (weapon) => (
          <FormatNumber
            style="unit"
            unit="second"
            unitDisplay="narrow"
            value={weapon.reloadSpeed}
          />
        )),
        weaponStat('Magazine size', (weapon, a) => {
          const magazine = getOneModuleFromReferences<'Magazine'>(
            weapon.magazine,
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
