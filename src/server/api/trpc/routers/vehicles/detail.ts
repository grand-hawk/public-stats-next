import { TRPCError } from '@trpc/server';
import slug from 'slug';

import { getVehicleLineage } from '@/server/api/trpc/routers/vehicles/lineage';
import {
  getVehicleContent,
  getVehicleMeta,
} from '@/server/utils/vehicleContent';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getKdr } from '@generated/kdr';
import { getLoadouts } from '@generated/loadouts';
import { getTeams } from '@generated/teams';
import { getVehicles } from '@generated/vehicles';

import type {
  DetailedVehicle,
  VehicleAvailability,
} from '@/server/api/trpc/routers/vehicles/types';
import type { PlaceId } from '@generated/config';

export function getVehicleBySlug(
  placeId: PlaceId,
  vehicleSlug: string,
): DetailedVehicle | null {
  const vehicles = getVehicles();
  const { data: config } = getConfig();

  const vehiclesPlace = vehicles.data[placeId];
  if (!vehiclesPlace) throw new TRPCError({ code: 'NOT_FOUND' });

  const vehicleName = vehiclesPlace.metadata.slugs[vehicleSlug];
  if (!vehicleName) return null;

  const loadoutsPlace = getLoadouts().data[placeId];
  const kdrPlace = getKdr().data[placeId];

  const vehicle = vehiclesPlace.data[vehicleName];
  const initials = config.placeNameInitials[vehiclesPlace.metadata.placeName];
  const baseUrl = getBaseUrl();

  const availability: VehicleAvailability = {};
  for (const [loadoutName, loadout] of Object.entries(loadoutsPlace.data)) {
    if (vehicleName in loadout.vehicles) {
      availability[loadoutName] = loadout.vehicles[vehicleName];
    }
  }

  const teamColor = getTeams().data[placeId]?.data.find(
    (team) => team.name === vehicle.info.team,
  )?.color;

  const contentSlug = slug(vehicle.info.gameId);

  return {
    ...vehicle,
    info: {
      ...vehicle.info,
      frontArmorDepth: getVehicleMeta(contentSlug)?.frontArmorDepth,
      name: vehicleName,
      lastRetrieved: vehicles.metadata.date,
      availability,
      kdr: kdrPlace.data.all_time[vehicleName],
      lineage: getVehicleLineage(placeId, vehicleName),
      teamColor:
        teamColor && /^#[0-9a-f]{3,8}$/i.test(teamColor)
          ? teamColor
          : undefined,
    },
    content: getVehicleContent(contentSlug) || undefined,
    linkedData: {
      breadcrumbs: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Vehicles',
            item: new URL(`${initials}/vehicles`, baseUrl).toString(),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: vehicleName,
          },
        ],
      },
    },
  };
}
