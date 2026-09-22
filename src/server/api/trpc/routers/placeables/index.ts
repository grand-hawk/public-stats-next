import { TRPCError } from '@trpc/server';
import slug from 'slug';
import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getTeamColor } from '@/server/api/trpc/routers/teams';
import { getPlaceableContent } from '@/server/utils/placeableContent';
import { getAllModulesOfType } from '@/utils/alterations';
import { getPlaceables } from '@generated/placeables';

import type { PlaceableImage } from '@/server/utils/placeableContent';
import type { ModulesDictionary } from '@/utils/alterations';
import type { PlaceId } from '@generated/config';
import type {
  PlaceableKind,
  PlaceablesPlaceDataPlaceable,
  PlaceablesPlaceDataPlaceableAvailability,
  PlaceablesPlaceDataPlaceableBuildAvailability,
  PlaceablesPlaceDataPlaceableLoadoutAvailability,
} from '@generated/placeables';

export interface PlaceableBuildAvailability
  extends PlaceablesPlaceDataPlaceableBuildAvailability {
  cap: number;
  loadoutSlug?: string;
}

export interface PlaceableLoadoutAvailability
  extends PlaceablesPlaceDataPlaceableLoadoutAvailability {
  loadoutSlug: string;
  teamSlug?: string;
}

export type PlaceableAvailability =
  | PlaceableBuildAvailability
  | PlaceableLoadoutAvailability;

export interface DetailedPlaceable
  extends Omit<PlaceablesPlaceDataPlaceable, 'availability'> {
  availability: PlaceableAvailability[];
  description?: string;
  image?: PlaceableImage;
  teamColor?: string;
}

export interface ListedPlaceable {
  cap?: number;
  classes: string[];
  cost?: number;
  damage?: number;
  health?: number;
  kind: PlaceableKind;
  loadouts: string[];
  maxPenetration?: number;
  name: string;
  slug: string;
  tier?: number;
  weapons: string[];
}

function getPlace(placeId: PlaceId) {
  const place = getPlaceables().data[placeId];
  if (!place) throw new TRPCError({ code: 'NOT_FOUND' });
  return place;
}

function weaponNames(placeable: PlaceablesPlaceDataPlaceable) {
  if (!placeable.modules) return [];

  return getAllModulesOfType(
    'Weapon',
    placeable.modules as ModulesDictionary,
  ).map((module) => module.data.name);
}

function isBuild(
  entry: PlaceablesPlaceDataPlaceableAvailability,
): entry is PlaceablesPlaceDataPlaceableBuildAvailability {
  return entry.via === 'buildTool';
}

function loadoutNames(placeable: PlaceablesPlaceDataPlaceable) {
  return [
    ...new Set(
      placeable.availability
        .map((entry) => entry.loadout)
        .filter((name): name is string => !!name),
    ),
  ];
}

export function listPlaceables(placeId: PlaceId): ListedPlaceable[] {
  const place = getPlace(placeId);

  return Object.values(place.data)
    .map((placeable): ListedPlaceable => {
      const projectiles = placeable.projectiles ?? [];
      const build = placeable.availability.find(isBuild);
      const weapons = weaponNames(placeable);

      return {
        cap: build ? place.metadata.buildToolCaps[build.tool] : undefined,
        classes: [
          ...new Set(
            placeable.availability.flatMap((entry) =>
              isBuild(entry) ? [] : [entry.class],
            ),
          ),
        ],
        cost: build?.cost,
        damage: projectiles[0]?.damage,
        health: placeable.health,
        kind: placeable.kind,
        loadouts: loadoutNames(placeable),
        maxPenetration:
          projectiles.length > 0
            ? Math.max(...projectiles.map((entry) => entry.maxPenetration))
            : undefined,
        name: placeable.name,
        slug: placeable.slug,
        tier: placeable.availability.find((entry) => !isBuild(entry))?.tier,
        weapons:
          weapons.length > 0
            ? weapons
            : projectiles.map((projectile) => projectile.name),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export function getPlaceableBySlug(
  placeId: PlaceId,
  placeableSlug: string,
): DetailedPlaceable | null {
  const place = getPlace(placeId);
  const name = place.metadata.slugs[placeableSlug];
  const placeable = name ? place.data[name] : undefined;
  if (!placeable) return null;

  const teams = new Set(
    placeable.availability.flatMap((entry) =>
      isBuild(entry) || !entry.team ? [] : [entry.team],
    ),
  );
  const [onlyTeam] = teams;

  return {
    ...placeable,
    availability: placeable.availability.map((entry) =>
      isBuild(entry)
        ? {
            ...entry,
            cap: place.metadata.buildToolCaps[entry.tool] ?? 0,
            loadoutSlug: entry.loadout ? slug(entry.loadout) : undefined,
          }
        : {
            ...entry,
            loadoutSlug: slug(entry.loadout),
            teamSlug: entry.team ? slug(entry.team) : undefined,
          },
    ),
    ...getPlaceableContent(placeable.slug, placeable.name),
    teamColor:
      teams.size === 1 && onlyTeam
        ? getTeamColor(placeId, onlyTeam)
        : undefined,
  };
}

export const placeablesRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }): ListedPlaceable[] =>
      listPlaceables(input.placeId as PlaceId),
    ),

  bySlug: publicProcedure
    .input(z.object({ placeId: z.string(), slug: z.string() }))
    .query(({ input }): DetailedPlaceable | null =>
      getPlaceableBySlug(input.placeId as PlaceId, input.slug),
    ),
});
