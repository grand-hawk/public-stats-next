import { TRPCError } from '@trpc/server';

import { assembleModules, getAllModulesOfType } from '@/utils/alterations';
import { isRecentlyAdded } from '@/utils/isRecentlyAdded';
import { simplifyString } from '@/utils/simplifyString';
import { getClassification } from '@/utils/vehicleClassification';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type {
  SearchEntry,
  VehicleRoster,
} from '@/server/api/trpc/routers/vehicles/types';
import type { PlaceId } from '@generated/config';
import type { VehiclesPlaceDataVehicleModule } from '@generated/vehicles';

type Mod<T extends VehiclesPlaceDataVehicleModule['type']> = Extract<
  VehiclesPlaceDataVehicleModule,
  { type: T }
>;

const searchIndexCache = new Map<PlaceId, SearchEntry[]>();
const eraOrderCache = new Map<PlaceId, string[]>();
const rosterTeamCache = new Map<PlaceId, string[]>();

function buildRosterIndex(placeId: PlaceId): Map<string, VehicleRoster[]> {
  const loadoutsPlace = getLoadouts().data[placeId];
  const loadoutsData = loadoutsPlace?.data ?? {};
  const rosters = new Map<string, VehicleRoster[]>();

  for (const [era, loadout] of Object.entries(loadoutsData)) {
    for (const [vehicleName, vehicle] of Object.entries(loadout.vehicles)) {
      const roster: VehicleRoster = { era, teams: Object.keys(vehicle.teams) };
      const current = rosters.get(vehicleName);
      if (current) current.push(roster);
      else rosters.set(vehicleName, [roster]);
    }
  }

  eraOrderCache.set(placeId, Object.keys(loadoutsData));
  rosterTeamCache.set(
    placeId,
    [...(loadoutsPlace?.metadata.teams ?? [])].sort((a, b) =>
      a.localeCompare(b),
    ),
  );
  return rosters;
}

export function buildSearchIndex(placeId: PlaceId): SearchEntry[] {
  const cached = searchIndexCache.get(placeId);
  if (cached) return cached;

  const vehiclesData = getVehicles().data[placeId]?.data;
  if (!vehiclesData) throw new TRPCError({ code: 'NOT_FOUND' });

  const rosterIndex = buildRosterIndex(placeId);

  const entries: SearchEntry[] = Object.entries(vehiclesData)
    .filter(([, data]) => !data.info.unlisted)
    .map(([name, data]) => {
      const mods = Object.values(data.modules);
      const turrets = mods
        .filter((m): m is Mod<'Turret'> => m.type === 'Turret')
        .map((m) => m.data);
      const baseModules = assembleModules(data, {});
      const driveDatas = getAllModulesOfType('DriveData', baseModules).map(
        (m) => m.data,
      );

      const powered = driveDatas.filter((d) => d.mass > 0);

      return {
        amphibious: data.info.amphibious,
        classification: getClassification(data.info.role),
        crew: getAllModulesOfType('Seat', baseModules).length,
        forwardSpeed:
          driveDatas.length > 0
            ? Math.max(...driveDatas.map((d) => d.engine.forwardSpeed))
            : 0,
        hasAPS: mods.some((m) => m.type === 'APS'),
        hasESS: mods
          .filter((m): m is Mod<'ESS'> => m.type === 'ESS')
          .some((m) => m.data.present),
        hasFCS: turrets.some((t) => t.sights.some((s) => s.fcs)),
        hasJammer: mods
          .filter((m): m is Mod<'EW'> => m.type === 'EW')
          .some((m) => m.data.ied || m.data.drone),
        hasLWS: turrets.some((t) => t.lws),
        hasMAWS: turrets.some((t) => t.maws),
        hasStabilizer: turrets.some((t) => t.stabilizer),
        hasThermal: turrets.some((t) => t.sights.some((s) => !!s.thermal)),
        locomotion: data.info.locomotion,
        obtainment: data.info.premium?.type ?? 'free',
        powerToWeight:
          powered.length > 0
            ? Math.max(...powered.map((d) => d.engine.horsepower / d.mass))
            : 0,
        rosters: rosterIndex.get(name) ?? [],
        simplifiedName: simplifyString(name),
        supportedClasses: data.info.supportedClasses,
        vehicle: {
          name,
          new: isRecentlyAdded(data.info.addedDate),
          premium: data.info.premium?.type,
          role: data.info.role,
          slug: data.info.slug,
          team: data.info.team,
        },
        weight:
          driveDatas.length > 0
            ? Math.max(...driveDatas.map((d) => d.mass))
            : 0,
      };
    })
    .sort((a, b) => a.vehicle.name.localeCompare(b.vehicle.name));

  searchIndexCache.set(placeId, entries);
  return entries;
}

export function getEraOrder(placeId: PlaceId): string[] {
  return eraOrderCache.get(placeId) ?? [];
}

export function getRosterTeams(placeId: PlaceId): string[] {
  return rosterTeamCache.get(placeId) ?? [];
}

export function matchesRoster(
  entry: SearchEntry,
  eras: ReadonlySet<string>,
  teams: ReadonlySet<string>,
): boolean {
  if (eras.size === 0 && teams.size === 0) return true;
  return entry.rosters.some(
    (roster) =>
      (eras.size === 0 || eras.has(roster.era)) &&
      (teams.size === 0 || roster.teams.some((team) => teams.has(team))),
  );
}
