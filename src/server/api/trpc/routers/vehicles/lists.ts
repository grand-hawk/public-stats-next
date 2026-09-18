import { TRPCError } from '@trpc/server';
import slug from 'slug';

import { IS_DEV } from '@/env';
import {
  buildVehiclePredicates,
  buildVehicleQueryPredicate,
} from '@/server/api/trpc/routers/vehicles/predicates';
import { buildSearchIndex } from '@/server/api/trpc/routers/vehicles/searchIndex';
import { getVehicleMeta } from '@/server/utils/vehicleContent';
import { isRecentlyAdded } from '@/utils/isRecentlyAdded';
import { getVehicles } from '@generated/vehicles';

import type { VehicleSearchInput } from '@/server/api/trpc/routers/vehicles/input';
import type { ListVehicle } from '@/server/api/trpc/routers/vehicles/types';
import type { PlaceId } from '@generated/config';

export function searchVehicles(input: VehicleSearchInput): ListVehicle[] {
  const entries = buildSearchIndex(input.placeId as PlaceId);

  const predicates = Object.values(buildVehiclePredicates(input));
  const matchesQuery = buildVehicleQueryPredicate(input);

  const result: ListVehicle[] = [];

  for (const entry of entries) {
    if (!matchesQuery(entry)) continue;
    if (!predicates.every((predicate) => predicate(entry))) continue;

    result.push(entry.vehicle);
  }

  return result;
}

export function listVehicles(placeId: PlaceId): ListVehicle[] {
  const vehiclesData = getVehicles().data[placeId]?.data;
  if (!vehiclesData) throw new TRPCError({ code: 'NOT_FOUND' });

  return Object.entries(vehiclesData)
    .filter(([, data]) => !data.info.unlisted)
    .map(([name, data]) => ({
      name,
      new: isRecentlyAdded(data.info.addedDate),
      premium: data.info.premium?.type,
      role: data.info.role,
      slug: data.info.slug,
      team: data.info.team,
      ...(IS_DEV
        ? {
            frontArmorDepth: getVehicleMeta(slug(data.info.gameId))
              ?.frontArmorDepth,
          }
        : {}),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
