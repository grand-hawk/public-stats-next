import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import loadouts from '@generated/loadouts';
import vehicles from '@generated/vehicles';

import type { PlaceId } from '@generated/config';
import type { LoadoutsPlaceDataLoadoutVehicle } from '@generated/loadouts';

export const loadoutsRouter = createTRPCRouter({
  vehicleAvailability: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }) => {
      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      if (!loadoutsPlace) return null;

      const vehiclesPlace = vehicles.data[input.placeId as PlaceId];
      if (!vehiclesPlace) return null;

      const vehicleName = vehiclesPlace.metadata.slugs[input.slug];
      if (!vehicleName) return null;

      const availability: Record<string, LoadoutsPlaceDataLoadoutVehicle> = {};

      for (const [loadoutName, loadout] of Object.entries(loadoutsPlace.data)) {
        if (vehicleName in loadout.vehicles)
          availability[loadoutName] = loadout.vehicles[vehicleName];
      }

      return availability;
    }),
});
