import { TRPCError } from '@trpc/server';
import slug from 'slug';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { createContentCollection } from '@/server/utils/contentCollection';
import { getLoadoutListItems } from '@/server/utils/loadoutsList';
import { computeRelatedPages } from '@/server/utils/relatedPages';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { RelatedPageItem } from '@/server/utils/relatedPages';
import type { PlaceId } from '@generated/config';
import type { LoadoutsPlaceDataLoadoutVehicleTeam } from '@generated/loadouts';
import type { VehiclesPlaceDataVehicleInfo } from '@generated/vehicles';

const loadoutCollection = createContentCollection<Record<string, never>>({
  dir: 'content/loadouts',
  parseMeta: () => ({}),
});

export type LoadoutVehicle = LoadoutsPlaceDataLoadoutVehicleTeam &
  Pick<VehiclesPlaceDataVehicleInfo, 'premium' | 'role' | 'slug'>;

export interface Loadout {
  name: string;
  description?: string;
  teams: {
    [team: string]: Record<string, LoadoutVehicle>;
  };
  relatedPages: RelatedPageItem[];
}

export type { LoadoutListItem } from '@/server/utils/loadoutsList';

export const loadoutsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }) => getLoadoutListItems(input.placeId as PlaceId)),

  bySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }): Loadout | null => {
      const loadouts = getLoadouts();
      const vehicles = getVehicles();

      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      if (!loadoutsPlace) throw new TRPCError({ code: 'NOT_FOUND' });

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
            premium: vehicleData.info.premium,
            role: vehicleData.info.role,
            slug: vehicleSlug,
          };
        }
      }

      const content = loadoutCollection.get(input.slug);
      const description = content?.body || undefined;
      const placeId = input.placeId as PlaceId;
      const { data: config } = getConfig();
      const initials =
        config.placeNameInitials[loadouts.data[placeId]!.metadata.placeName];

      return {
        name: loadoutName,
        description,
        teams: loadoutTeams,
        relatedPages: computeRelatedPages(description, placeId, initials),
      } satisfies Loadout;
    }),
});
