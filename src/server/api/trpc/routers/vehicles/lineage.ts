import slug from 'slug';

import { getTeams } from '@generated/teams';
import { getVehicles } from '@generated/vehicles';

import type {
  LineageVehicle,
  VehicleFamily,
  VehicleFamilySummary,
  VehicleLineage,
} from '@/server/api/trpc/routers/vehicles/types';
import type { PlaceId } from '@generated/config';
import type { VehiclesData } from '@generated/vehicles';

type VehiclesPlace = VehiclesData[PlaceId];

const byName = (a: LineageVehicle, b: LineageVehicle) =>
  a.name.localeCompare(b.name, undefined, { numeric: true });

function listed(place: VehiclesPlace, name: string | undefined) {
  if (!name) return false;
  const vehicle = place.data[name];
  return !!vehicle && !vehicle.info.unlisted;
}

function nameByGameId(place: VehiclesPlace) {
  return new Map(
    Object.entries(place.data).map(([name, vehicle]) => [
      vehicle.info.gameId,
      name,
    ]),
  );
}

function toLineageVehicle(place: VehiclesPlace, name: string): LineageVehicle {
  const { info } = place.data[name];
  return {
    name,
    premium: info.premium?.type,
    role: info.role,
    slug: info.slug,
    team: info.team,
  };
}

function familyOf(place: VehiclesPlace, name: string) {
  return Object.entries(place.metadata.families ?? {}).find(([, members]) =>
    members.includes(name),
  )?.[0];
}

export function getVehicleLineage(
  placeId: PlaceId,
  vehicleName: string,
): VehicleLineage {
  const place = getVehicles().data[placeId];
  const vehicle = place?.data[vehicleName];
  if (!vehicle) return { variants: [] };

  const names = nameByGameId(place);
  const baseName = vehicle.info.variantOf
    ? names.get(vehicle.info.variantOf)
    : undefined;
  const rootName = listed(place, baseName) ? baseName! : vehicleName;
  const rootGameId = place.data[rootName].info.gameId;

  const variants = Object.entries(place.data)
    .filter(
      ([name, entry]) =>
        name !== vehicleName &&
        !entry.info.unlisted &&
        (name === rootName || entry.info.variantOf === rootGameId),
    )
    .map(([name]) => toLineageVehicle(place, name))
    .sort((a, b) =>
      a.name === rootName ? -1 : b.name === rootName ? 1 : byName(a, b),
    );

  const family = familyOf(place, vehicleName);

  return {
    family: family ? { name: family, slug: slug(family) } : undefined,
    variantOf:
      baseName && listed(place, baseName)
        ? { name: baseName, slug: place.data[baseName].info.slug }
        : undefined,
    variants,
  };
}

function summarise(
  place: VehiclesPlace,
  name: string,
  members: string[],
): VehicleFamilySummary {
  const present = members.filter((member) => listed(place, member));

  return {
    count: present.length,
    name,
    slug: slug(name),
    teams: [
      ...new Set(present.map((member) => place.data[member].info.team)),
    ].sort((a, b) => a.localeCompare(b)),
  };
}

export function listVehicleFamilies(placeId: PlaceId): VehicleFamilySummary[] {
  const place = getVehicles().data[placeId];
  if (!place) return [];

  return Object.entries(place.metadata.families ?? {})
    .map(([name, members]) => summarise(place, name, members))
    .filter((family) => family.count > 1)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getVehicleFamily(
  placeId: PlaceId,
  familySlug: string,
): VehicleFamily | null {
  const place = getVehicles().data[placeId];
  if (!place) return null;

  const entry = Object.entries(place.metadata.families ?? {}).find(
    ([name]) => slug(name) === familySlug,
  );
  if (!entry) return null;

  const [name, members] = entry;
  const vehicles = members
    .filter((member) => listed(place, member))
    .map((member) => toLineageVehicle(place, member))
    .sort(byName);

  const teams = new Set(vehicles.map((vehicle) => vehicle.team));
  const [team] = teams;
  const teamColor =
    teams.size === 1
      ? getTeams().data[placeId]?.data.find((entry) => entry.name === team)
          ?.color
      : undefined;

  const teamList = [...teams];
  const related = listVehicleFamilies(placeId)
    .filter((candidate) => candidate.slug !== familySlug)
    .map((candidate) => ({
      candidate,
      shared: candidate.teams.filter((entry) => teamList.includes(entry))
        .length,
    }))
    .sort((a, b) => b.shared - a.shared || b.candidate.count - a.candidate.count)
    .slice(0, 8)
    .map(({ candidate }) => candidate);

  return {
    name,
    placeName: place.metadata.placeName,
    related,
    slug: familySlug,
    teamColor:
      teamColor && /^#[0-9a-f]{3,8}$/i.test(teamColor) ? teamColor : undefined,
    vehicles,
  };
}
