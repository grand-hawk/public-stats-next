import slug from 'slug';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { createContentCollection } from '@/server/utils/contentCollection';
import { computeRelatedPages } from '@/server/utils/relatedPages';
import { isRecentlyAdded } from '@/utils/isRecentlyAdded';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';
import type { RelatedPageItem } from '@/server/utils/relatedPages';
import type { PlaceId } from '@generated/config';
import type { LoadoutsPlaceDataLoadoutVehicleTeam } from '@generated/loadouts';
import type { VehiclesPlaceDataVehicleInfo } from '@generated/vehicles';

interface TeamMeta {
  lore?: boolean;
}

const teamCollection = createContentCollection<TeamMeta>({
  dir: 'content/teams',
  parseMeta: (raw) => ({
    lore: typeof raw.lore === 'boolean' ? raw.lore : undefined,
  }),
});

export interface TeamVehicle
  extends
    LoadoutsPlaceDataLoadoutVehicleTeam,
    Pick<VehiclesPlaceDataVehicleInfo, 'role' | 'slug'> {
  premiumType?: NonNullable<VehiclesPlaceDataVehicleInfo['premium']>['type'];
}

export interface Team {
  name: string;
  description?: string;
  lore: boolean;
  loadouts: {
    [loadout: string]: Record<string, TeamVehicle>;
  };
  loreVehicles: ListVehicle[];
  relatedPages: RelatedPageItem[];
}

export interface TeamListEntry {
  name: string;
  slug: string;
  lore: boolean;
}

function collectTeamNames(placeId: PlaceId) {
  const loadoutsPlace = getLoadouts().data[placeId]!;
  const vehiclesPlace = getVehicles().data[placeId]!;

  const playable = new Set(loadoutsPlace.metadata.teams);
  const all = new Set(playable);

  for (const vehicle of Object.values(vehiclesPlace.data)) {
    if (vehicle.info.team) all.add(vehicle.info.team);
  }

  return { playable, all };
}

export const teamsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }): TeamListEntry[] => {
      const { all, playable } = collectTeamNames(input.placeId as PlaceId);

      return [...all]
        .map((team) => ({
          name: team,
          slug: slug(team),
          lore: !playable.has(team),
        }))
        .sort((a, b) => {
          if (a.lore !== b.lore) return a.lore ? 1 : -1;
          return a.name.localeCompare(b.name);
        });
    }),

  bySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }): Team | null => {
      const placeId = input.placeId as PlaceId;
      const { all, playable } = collectTeamNames(placeId);

      const teamName = [...all].find((team) => slug(team) === input.slug);
      if (!teamName) return null;

      const isLore = !playable.has(teamName);

      const loadoutsPlace = getLoadouts().data[placeId]!;
      const vehiclesPlace = getVehicles().data[placeId]!;

      const includedLoadouts = isLore
        ? []
        : Object.entries(loadoutsPlace.data).filter(([_, loadout]) =>
            loadout.teams.includes(teamName),
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
                      premiumType: vehicleData.info.premium?.type,
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

      const loreVehicles: ListVehicle[] = Object.entries(vehiclesPlace.data)
        .filter(
          ([_, vehicle]) =>
            vehicle.info.team === teamName && !vehicle.info.unlisted,
        )
        .map(([vehicleName, vehicle]) => ({
          name: vehicleName,
          new: isRecentlyAdded(vehicle.info.addedDate),
          premium: vehicle.info.premium?.type,
          role: vehicle.info.role,
          slug: vehicle.info.slug,
          team: vehicle.info.team,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      const content = teamCollection.get(input.slug);
      const description = content?.body || undefined;
      const { data: config } = getConfig();
      const initials =
        config.placeNameInitials[
          getLoadouts().data[placeId]!.metadata.placeName
        ];

      return {
        name: teamName,
        description,
        lore: isLore,
        loadouts: teamLoadouts,
        loreVehicles,
        relatedPages: computeRelatedPages(description, placeId, initials),
      } satisfies Team;
    }),
});
