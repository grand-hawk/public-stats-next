import { TRPCError } from '@trpc/server';
import slug from 'slug';
import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getVehicleContent } from '@/server/utils/vehicleContent';
import { getVehicleImage } from '@/utils/getVehicleImage';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getKdr } from '@generated/kdr';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';
import { getVehiclesLd } from '@generated/vehicles_ld';

import type { VehicleContent } from '@/server/utils/vehicleContent';
import type { PlaceId } from '@generated/config';
import type { KdrPlaceDataVehicle } from '@generated/kdr';
import type { LoadoutsPlaceDataLoadoutVehicle } from '@generated/loadouts';
import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';
import type { BreadcrumbList, Vehicle, WithContext } from 'schema-dts';

export interface ListVehicle {
  name: string;
  slug: string;
  team: string;
  role: string;
  new?: boolean;
}

export type VehicleAvailability = Record<
  string,
  LoadoutsPlaceDataLoadoutVehicle
>;

export type DetailedVehicle = VehiclesPlaceDataVehicle & {
  info: {
    name: string;
    lastRetrieved: string;
    availability: VehicleAvailability;
    kdr: KdrPlaceDataVehicle;
  };
  content?: VehicleContent;
  linkedData: Partial<{
    breadcrumbs: WithContext<BreadcrumbList>;
    vehicle: WithContext<Vehicle>;
  }>;
};

export const vehiclesRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }) => {
      const vehicles = getVehicles();

      const vehiclesData = vehicles.data[input.placeId as PlaceId]?.data;
      if (!vehiclesData) throw new TRPCError({ code: 'NOT_FOUND' });

      const dateNow = Date.now();

      return Object.entries(vehiclesData)
        .map(
          ([name, data]) =>
            ({
              name,
              slug: data.info.slug,
              team: data.info.team,
              role: data.info.role,
              new: data.info.addedDate
                ? dateNow - new Date(data.info.addedDate).getTime() <
                  1_000 * 60 * 60 * 24 * 31
                : undefined,
            }) satisfies ListVehicle,
        )
        .sort((a, b) => a.name.localeCompare(b.name)) as ListVehicle[];
    }),

  bySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }) => {
      const vehicles = getVehicles();
      const loadouts = getLoadouts();
      const kdr = getKdr();
      const vehiclesLd = getVehiclesLd();
      const { data: config } = getConfig();

      const vehiclesPlace = vehicles.data[input.placeId as PlaceId];
      if (!vehiclesPlace) throw new TRPCError({ code: 'NOT_FOUND' });

      const vehicleName = vehiclesPlace.metadata.slugs[input.slug];
      if (!vehicleName) return null;

      const loadoutsPlace = loadouts.data[input.placeId as PlaceId];
      const kdrPlace = kdr.data[input.placeId as PlaceId];
      const linkedData = vehiclesLd.data[
        input.placeId as PlaceId
      ] as unknown as Record<string, WithContext<Vehicle>>;

      const vehicle = vehiclesPlace.data[vehicleName];
      const initials =
        config.placeNameInitials[vehiclesPlace.metadata.placeName];
      const baseUrl = getBaseUrl();

      const availability: VehicleAvailability = {};
      for (const [loadoutName, loadout] of Object.entries(loadoutsPlace.data)) {
        if (vehicleName in loadout.vehicles) {
          availability[loadoutName] = loadout.vehicles[vehicleName];
        }
      }

      const namedVehicle: DetailedVehicle = {
        ...vehicle,
        info: {
          ...vehicle.info,
          name: vehicleName,
          lastRetrieved: vehicles.metadata.date,
          availability,
          kdr: kdrPlace.data.all_time[vehicleName],
        },
        content: getVehicleContent(slug(vehicle.info.gameId)) || undefined,
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
          vehicle: {
            ...linkedData[vehicleName],
            url: new URL(
              `${initials}/vehicles/${input.slug}`,
              baseUrl,
            ).toString(),
            image: getVehicleImage(input.slug),
          },
        },
      };

      return namedVehicle;
    }),
});
