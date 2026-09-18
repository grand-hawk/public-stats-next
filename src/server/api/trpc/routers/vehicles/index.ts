import { TRPCError } from '@trpc/server';
import z from 'zod';

import { IS_DEV } from '@/env';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getVehicleBySlug } from '@/server/api/trpc/routers/vehicles/detail';
import { computeVehicleFacets } from '@/server/api/trpc/routers/vehicles/facets';
import { setFrontArmorDepth } from '@/server/api/trpc/routers/vehicles/frontArmor';
import { vehicleSearchInput } from '@/server/api/trpc/routers/vehicles/input';
import {
  listVehicles,
  searchVehicles,
} from '@/server/api/trpc/routers/vehicles/lists';

import type {
  DetailedVehicle,
  ListVehicle,
  VehicleSearchFacets,
} from '@/server/api/trpc/routers/vehicles/types';
import type { PlaceId } from '@generated/config';

export type {
  DetailedVehicle,
  ListVehicle,
  VehicleAvailability,
  VehicleFeatureKey,
  VehicleSearchFacets,
} from '@/server/api/trpc/routers/vehicles/types';

export const vehiclesRouter = createTRPCRouter({
  searchFacets: publicProcedure
    .input(vehicleSearchInput)
    .query(({ input }): VehicleSearchFacets => computeVehicleFacets(input)),

  search: publicProcedure
    .input(vehicleSearchInput)
    .query(({ input }): ListVehicle[] => searchVehicles(input)),

  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }): ListVehicle[] =>
      listVehicles(input.placeId as PlaceId),
    ),

  bySlug: publicProcedure
    .input(z.object({ placeId: z.string(), slug: z.string() }))
    .query(({ input }): DetailedVehicle | null =>
      getVehicleBySlug(input.placeId as PlaceId, input.slug),
    ),

  setFrontArmorDepth: publicProcedure
    .input(z.object({ slug: z.string(), value: z.number().min(0).max(100) }))
    .mutation(({ input }): void => {
      if (!IS_DEV) throw new TRPCError({ code: 'UNAUTHORIZED' });
      setFrontArmorDepth(input.slug, input.value);
    }),
});
