import { existsSync } from 'node:fs';

import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getBaseUrl } from '@/utils/trpc';
import config from '@generated/config';
import vehicles from '@generated/vehicles';
import vehicles_ld from '@generated/vehicles_ld';

import type { PlaceId } from '@generated/config';
import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';
import type { BreadcrumbList, Vehicle, WithContext } from 'schema-dts';

export interface ListVehicle {
  name: string;
  slug: string;
  team: string;
  role: string;
}

export type DetailedVehicle = VehiclesPlaceDataVehicle & {
  info: {
    name: string;
    image: string | null;
    lastRetrieved: string;
  };
  linkedData: {
    breadcrumbs: WithContext<BreadcrumbList>;
    vehicle: WithContext<Vehicle>;
  };
};

const imageCache = new Map<string, string | null>();

function getVehicleImage(slug: string) {
  let cachedImage = imageCache.get(slug);
  if (cachedImage === undefined) {
    const imageUrl = `/assets/vehicles/${slug}.png`;
    const imageResult =
      !imageUrl.startsWith('/') || existsSync(`./public${imageUrl}`)
        ? imageUrl
        : null;

    imageCache.set(slug, imageResult);
    cachedImage = imageResult;
  }

  return cachedImage;
}

export const vehiclesRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }) => {
      const data = vehicles.data[input.placeId as PlaceId]?.data;
      if (!data) return []; // This validates placeId

      return Object.entries(data)
        .map(([name, data]) => ({
          name,
          slug: data.info.slug,
          team: data.info.team,
          role: data.info.role,
        }))
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
      const place = vehicles.data[input.placeId as PlaceId];
      if (!place) return null; // This validates placeId

      const vehicleName = place.metadata.slugs[input.slug];
      if (!vehicleName) return null; // This validates slug

      const linkedData = vehicles_ld.data[
        input.placeId as PlaceId
      ] as unknown as Record<string, WithContext<Vehicle>>;

      const vehicle = place.data[vehicleName];
      const initials = config.data.placeNameInitials[place.metadata.placeName];
      const relativeImageUrl = getVehicleImage(input.slug);
      const baseUrl = getBaseUrl();
      const publicImageUrl =
        relativeImageUrl?.startsWith('/') &&
        new URL(relativeImageUrl, baseUrl).toString();

      const namedVehicle: DetailedVehicle = {
        ...vehicle,
        info: {
          ...vehicle.info,
          name: vehicleName,
          image: relativeImageUrl,
          lastRetrieved: vehicles.metadata.date,
        },
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
            image: publicImageUrl || undefined,
          },
        },
      };

      return namedVehicle;
    }),
});
