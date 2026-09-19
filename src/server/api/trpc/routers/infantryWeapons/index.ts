import { TRPCError } from '@trpc/server';
import slug from 'slug';
import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getTeamColor } from '@/server/api/trpc/routers/teams';
import { getWeaponContent } from '@/server/utils/weaponContent';
import {
  infantryWeaponCategory,
  rateOfFireLabel,
} from '@/utils/infantryWeapons';
import { getInfantryWeapons } from '@generated/infantry_weapons';

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
  image?: WeaponImage;
  teamColor?: string;
  unlimitedReserve?: boolean;
}

export interface TeamWeapon {
  class: string;
  displayType?: string;
  name: string;
  slot: InfantryWeaponSlot;
  slug: string;
  tier: number;
}

export interface ListedInfantryWeapon {
  category: InfantryWeaponCategoryKey;
  displayType?: string;
  humanoidDamage?: number;
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
        displayType: projectile?.displayType,
        humanoidDamage: projectile?.humanoidDamage,
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
        displayType: weapon.projectiles[0]?.displayType,
        name: weapon.name,
        slot: entry.slot,
        slug: weapon.slug,
        tier: entry.tier ?? 1,
      })),
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
