import { TRPCError } from '@trpc/server';
import slug from 'slug';
import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getTeamColor } from '@/server/api/trpc/routers/teams';
import { getWeaponContent } from '@/server/utils/weaponContent';
import {
  INFANTRY_WEAPONS_PATH,
  infantryWeaponCategory,
  infantryWeaponIcon,
  rateOfFireLabel,
} from '@/utils/infantryWeapons';
import { PLACEABLES_PATH, placeableDisplayName } from '@/utils/placeables';
import { getInfantryWeapons } from '@generated/infantry_weapons';
import { getPlaceables } from '@generated/placeables';

import type { WeaponImage } from '@/server/utils/weaponContent';
import type { InfantryWeaponCategoryKey } from '@/utils/infantryWeapons';
import type { PlaceId } from '@generated/config';
import type {
  InfantryWeaponSlot,
  InfantryWeaponsPlaceDataWeapon,
  InfantryWeaponsPlaceDataWeaponAvailability,
} from '@generated/infantry_weapons';

export interface InfantryWeaponAvailability extends InfantryWeaponsPlaceDataWeaponAvailability {
  loadoutSlug: string;
  teamSlug?: string;
}

export interface DetailedInfantryWeapon extends Omit<
  InfantryWeaponsPlaceDataWeapon,
  'availability'
> {
  availability: InfantryWeaponAvailability[];
  category: InfantryWeaponCategoryKey;
  description?: string;
  icon: string;
  image?: WeaponImage;
  teamColor?: string;
  unlimitedReserve?: boolean;
}

export interface TeamWeapon {
  class: string;
  icon: string;
  name: string;
  path: string;
  slot: InfantryWeaponSlot;
  slug: string;
  tier: number;
}

export interface ListedInfantryWeapon {
  category: InfantryWeaponCategoryKey;
  humanoidDamage?: number;
  icon: string;
  loadouts: string[];
  magazineSize?: number;
  maxPenetration?: number;
  name: string;
  rateOfFire: string;
  slug: string;
  type?: string;
  velocity?: number;
}

function getPlace(placeId: PlaceId) {
  const place = getInfantryWeapons().data[placeId];
  if (!place) throw new TRPCError({ code: 'NOT_FOUND' });
  return place;
}

export function listInfantryWeapons(placeId: PlaceId): ListedInfantryWeapon[] {
  return Object.values(getPlace(placeId).data)
    .map((weapon): ListedInfantryWeapon => {
      const projectile = weapon.projectiles[0];

      return {
        category: infantryWeaponCategory(projectile),
        humanoidDamage: projectile?.humanoidDamage,
        icon: infantryWeaponIcon(projectile),
        loadouts: [
          ...new Set(weapon.availability.map((entry) => entry.loadout)),
        ],
        magazineSize: weapon.magazineSize,
        maxPenetration: projectile
          ? Math.max(...weapon.projectiles.map((entry) => entry.maxPenetration))
          : undefined,
        name: weapon.name,
        rateOfFire: rateOfFireLabel(weapon),
        slug: weapon.slug,
        type: projectile?.type,
        velocity: projectile?.velocity,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export function listTeamWeapons(
  placeId: PlaceId,
  loadout: string,
  team: string,
): TeamWeapon[] {
  const place = getInfantryWeapons().data[placeId];
  if (!place) return [];

  return Object.values(place.data).flatMap((weapon) =>
    weapon.availability
      .filter(
        (entry) =>
          entry.loadout === loadout && (!entry.team || entry.team === team),
      )
      .map((entry) => ({
        class: entry.class,
        icon: infantryWeaponIcon(weapon.projectiles[0]),
        name: weapon.name,
        path: INFANTRY_WEAPONS_PATH,
        slot: entry.slot,
        slug: weapon.slug,
        tier: entry.tier ?? 1,
      })),
  );
}

export function listTeamPlaceables(
  placeId: PlaceId,
  loadout: string,
  team: string,
): TeamWeapon[] {
  const place = getPlaceables().data[placeId];
  if (!place) return [];

  return Object.values(place.data).flatMap((placeable) =>
    placeable.availability.flatMap((entry) => {
      if (entry.via !== 'loadout' || entry.loadout !== loadout) return [];
      if (entry.team && entry.team !== team) return [];

      return [
        {
          class: entry.class,
          icon: infantryWeaponIcon(placeable.projectiles?.[0]),
          name: placeableDisplayName(placeable.name),
          path: PLACEABLES_PATH,
          slot: entry.slot,
          slug: placeable.slug,
          tier: entry.tier,
        },
      ];
    }),
  );
}

export function getInfantryWeaponBySlug(
  placeId: PlaceId,
  weaponSlug: string,
): DetailedInfantryWeapon | null {
  const place = getPlace(placeId);
  const name = place.metadata.slugs[weaponSlug];
  const weapon = name ? place.data[name] : undefined;
  if (!weapon) return null;

  const teams = new Set(weapon.availability.map((entry) => entry.team));
  const [onlyTeam] = teams;

  return {
    ...weapon,
    availability: weapon.availability.map((entry) => ({
      ...entry,
      loadoutSlug: slug(entry.loadout),
      teamSlug: entry.team ? slug(entry.team) : undefined,
    })),
    category: infantryWeaponCategory(weapon.projectiles[0]),
    icon: infantryWeaponIcon(weapon.projectiles[0]),
    ...getWeaponContent(weapon.slug, weapon.name),
    teamColor:
      teams.size === 1 && onlyTeam
        ? getTeamColor(placeId, onlyTeam)
        : undefined,
  };
}

export const infantryWeaponsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(({ input }): ListedInfantryWeapon[] =>
      listInfantryWeapons(input.placeId as PlaceId),
    ),

  bySlug: publicProcedure
    .input(z.object({ placeId: z.string(), slug: z.string() }))
    .query(({ input }): DetailedInfantryWeapon | null =>
      getInfantryWeaponBySlug(input.placeId as PlaceId, input.slug),
    ),
});
