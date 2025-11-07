import slug from 'slug';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { PlaceId } from '@generated/config';
import type { LoadoutsPlaceDataLoadoutVehicleTeam } from '@generated/loadouts';
import type { VehiclesPlaceDataVehicleInfo } from '@generated/vehicles';

export interface Team {
  name: string;
  loadouts: {
    [loadout: string]: Record<
      string,
      LoadoutsPlaceDataLoadoutVehicleTeam &
        Pick<VehiclesPlaceDataVehicleInfo, 'premium' | 'role'>
    >;
  };
}

export const teamsRouter = createTRPCRouter({
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

                  return [
                    vehicleName,
                    {
                      ...vehicle,
                      role: vehicleData.info.role,
                      premium: vehicleData.info.premium,
                    } satisfies Team['loadouts'][string][string],
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
