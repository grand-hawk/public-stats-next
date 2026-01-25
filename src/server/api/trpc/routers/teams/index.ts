import slug from 'slug';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getVehicleImage } from '@/server/api/trpc/routers/vehicles';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { PlaceId } from '@generated/config';
import type { LoadoutsPlaceDataLoadoutVehicleTeam } from '@generated/loadouts';
import type { VehiclesPlaceDataVehicleInfo } from '@generated/vehicles';

export interface TeamVehicle
  extends
    LoadoutsPlaceDataLoadoutVehicleTeam,
    Pick<VehiclesPlaceDataVehicleInfo, 'premium' | 'role' | 'slug'> {
  image: string | null;
}

export interface Team {
  name: string;
  loadouts: {
    [loadout: string]: Record<string, TeamVehicle>;
  };
}

export const teamsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }) => {
      const loadouts = getLoadouts();
      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      if (!loadoutsPlace) return [];

      return loadoutsPlace.metadata.teams.map((team) => ({
        name: team,
        slug: slug(team),
      }));
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
      if (!loadoutsPlace) return null; // This validates placeId

      const teamName = loadoutsPlace.metadata.teams.find(
        (team) => slug(team) === input.slug,
      );
      if (!teamName) return null; // This validates slug

      const vehiclesPlace = vehicles.data[input.placeId as PlaceId];

      const includedLoadouts = Object.entries(loadoutsPlace.data).filter(
        ([_, loadout]) => loadout.teams.includes(teamName),
      );

      const teamLoadouts: Team['loadouts'] = Object.fromEntries(
        includedLoadouts
          .map(([loadoutName, loadout]) => [
            loadoutName,
            Object.fromEntries(
              (
                Object.entries(loadout.vehicles).map(
                  ([vehicleName, vehicle]) => [
                    vehicleName,
                    vehicle.teams[teamName],
                  ],
                ) as Array<[string, LoadoutsPlaceDataLoadoutVehicleTeam]>
              )
                .filter(
                  ([vehicle, team]) =>
                    vehiclesPlace.data[vehicle] && team !== undefined,
                )
                .map(([vehicleName, vehicle]) => {
                  const vehicleData = vehiclesPlace.data[vehicleName];
                  const vehicleSlug = vehicleData.info.slug;

                  return [
                    vehicleName,
                    {
                      ...vehicle,
                      image: getVehicleImage(vehicleSlug),
                      premium: vehicleData.info.premium,
                      role: vehicleData.info.role,
                      slug: vehicleSlug,
                    } satisfies TeamVehicle,
                  ];
                })
                .filter(([_, vehicle]) => vehicle !== null),
            ),
          ])
          .filter(([_, vehicles]) => Object.keys(vehicles).length > 0),
      );

      return {
        name: teamName,
        loadouts: teamLoadouts,
      } satisfies Team;
    }),
});
