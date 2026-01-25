import slug from 'slug';
import { z } from 'zod';

import { MEDIA_PREFIX } from '@/env';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getVehicleImage } from '@/server/api/trpc/routers/vehicles';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { PlaceId } from '@generated/config';
import type { LoadoutsPlaceDataLoadoutVehicleTeam } from '@generated/loadouts';
import type { VehiclesPlaceDataVehicleInfo } from '@generated/vehicles';

export interface LoadoutVehicle
  extends
    LoadoutsPlaceDataLoadoutVehicleTeam,
    Pick<VehiclesPlaceDataVehicleInfo, 'premium' | 'role' | 'slug'> {
  image: string | null;
}

export interface Loadout {
  name: string;
  teams: {
    [team: string]: Record<string, LoadoutVehicle>;
  };
}

export const loadoutsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }) => {
      const loadouts = getLoadouts();
      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      if (!loadoutsPlace) return [];

      return loadoutsPlace.metadata.loadouts.map((loadoutName) => {
        const loadoutSlug = slug(loadoutName);
        const loadoutData = loadoutsPlace.data[loadoutName];

        return {
          description: loadoutData?.description ?? '',
          name: loadoutName,
          slug: loadoutSlug,
          thumbnail: `${MEDIA_PREFIX}/assets/loadouts/thumbnails/${loadoutSlug}.png`,
        };
      });
    }),

  bySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }) => {
      const loadouts = getLoadouts();
      const vehicles = getVehicles();

      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      if (!loadoutsPlace) return null;

      const loadoutName = loadoutsPlace.metadata.loadouts.find(
        (name) => slug(name) === input.slug,
      );
      if (!loadoutName) return null;

      const loadoutData = loadoutsPlace.data[loadoutName];
      if (!loadoutData) return null;

      const vehiclesPlace = vehicles.data[input.placeId as PlaceId];

      const loadoutTeams: Loadout['teams'] = {};

      for (const teamName of loadoutData.teams) {
        loadoutTeams[teamName] = {};

        for (const [vehicleName, vehicle] of Object.entries(
          loadoutData.vehicles,
        )) {
          const teamData = vehicle.teams[teamName];
          if (!teamData) continue;

          const vehicleData = vehiclesPlace?.data[vehicleName];
          if (!vehicleData) continue;

          const vehicleSlug = vehicleData.info.slug;

          loadoutTeams[teamName][vehicleName] = {
            ...teamData,
            image: getVehicleImage(vehicleSlug),
            premium: vehicleData.info.premium,
            role: vehicleData.info.role,
            slug: vehicleSlug,
          };
        }
      }

      return {
        name: loadoutName,
        teams: loadoutTeams,
      } satisfies Loadout;
    }),
});
