import { TRPCError } from '@trpc/server';
import z from 'zod';

import {
  DAMAGE_TEST,
  EXP_MASS_TEST,
  MASS_TEST,
  matchesAny,
  PEN_TEST,
  VEL_TEST,
} from '@/components/features/shells/browse/filterBands';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { simplifyString } from '@/utils/simplifyString';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getShells } from '@generated/shells';

import type { PlaceId } from '@generated/config';
import type { ShellsPlaceDataShell } from '@generated/shells';
import type { BreadcrumbList, WithContext } from 'schema-dts';

export interface ListedShellBase {
  displayType: string;
  name: string;
  slug: string;
  vehicles: string[];
}

export interface ListedShellForBrowse extends ListedShellBase {
  damage: number;
  explosiveMass: number;
  hasExplosive: boolean;
  hasIRCCM: boolean;
  isLaser: boolean;
  isUnjammable: boolean;
  mass: number;
  maxPenetration: number;
  velocity: number;
}

export type ShellsListForBrowse = Record<string, ListedShellForBrowse[]>;

interface BrowseIndexEntry {
  shell: ListedShellForBrowse;
  simplifiedName: string;
  simplifiedVehicles: string[];
}

interface BrowseIndex {
  weapons: Array<{
    weapon: string;
    simplifiedWeapon: string;
    entries: BrowseIndexEntry[];
  }>;
}

const browseIndexCache = new Map<PlaceId, BrowseIndex>();

function buildBrowseIndex(placeId: PlaceId): BrowseIndex {
  const cached = browseIndexCache.get(placeId);
  if (cached) return cached;

  const shellsData = getShells().data[placeId]?.data;
  if (!shellsData) throw new TRPCError({ code: 'NOT_FOUND' });

  const weapons = Object.entries(shellsData)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([weapon, shellArr]) => ({
      weapon,
      simplifiedWeapon: simplifyString(weapon),
      entries: shellArr.map((shell): BrowseIndexEntry => {
        const listed: ListedShellForBrowse = {
          damage: shell.damage,
          displayType: shell.displayType,
          explosiveMass: shell.explosive?.mass ?? 0,
          hasExplosive: !!shell.explosive,
          hasIRCCM: shell.missile?.irccm ?? false,
          isLaser: shell.laser ?? false,
          isUnjammable: shell.missile?.unjammable ?? false,
          mass: shell.mass,
          maxPenetration: shell.maxPenetration,
          name: shell.name,
          slug: shell.slug,
          vehicles: shell.vehicles,
          velocity: shell.velocity,
        };
        return {
          shell: listed,
          simplifiedName: simplifyString(shell.name),
          simplifiedVehicles: shell.vehicles.map(simplifyString),
        };
      }),
    }));

  const index: BrowseIndex = { weapons };
  browseIndexCache.set(placeId, index);
  return index;
}

function listShellsBase(placeId: PlaceId): Record<string, ListedShellBase[]> {
  const shellsData = getShells().data[placeId]?.data;
  if (!shellsData) throw new TRPCError({ code: 'NOT_FOUND' });

  return Object.fromEntries(
    Object.entries(shellsData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([weapon, shellArr]) => [
        weapon,
        shellArr.map(
          (shell): ListedShellBase => ({
            displayType: shell.displayType,
            name: shell.name,
            slug: shell.slug,
            vehicles: shell.vehicles,
          }),
        ),
      ]),
  );
}

export interface DetailedShell extends ShellsPlaceDataShell {
  weapon: string;
  linkedData: Partial<{
    breadcrumbs: WithContext<BreadcrumbList>;
  }>;
}

export const shellsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(
      ({ input }): Record<string, ListedShellBase[]> =>
        listShellsBase(input.placeId as PlaceId),
    ),

  search: publicProcedure
    .input(
      z.object({
        damage: z.array(z.string()).default([]),
        explosive: z.boolean().default(false),
        explosiveMass: z.array(z.string()).default([]),
        irccm: z.boolean().default(false),
        laser: z.boolean().default(false),
        mass: z.array(z.string()).default([]),
        penetration: z.array(z.string()).default([]),
        placeId: z.string(),
        query: z.string().default(''),
        unjammable: z.boolean().default(false),
        velocity: z.array(z.string()).default([]),
      }),
    )
    .query(({ input }): ShellsListForBrowse => {
      const index = buildBrowseIndex(input.placeId as PlaceId);

      const mass = new Set(input.mass);
      const explosiveMass = new Set(input.explosiveMass);
      const damage = new Set(input.damage);
      const penetration = new Set(input.penetration);
      const velocity = new Set(input.velocity);
      const normalizedQuery = input.query ? simplifyString(input.query) : null;

      const result: ShellsListForBrowse = {};

      for (const group of index.weapons) {
        const weaponMatchesQuery = normalizedQuery
          ? group.simplifiedWeapon.includes(normalizedQuery)
          : true;

        const matching: ListedShellForBrowse[] = [];
        for (const entry of group.entries) {
          const shell = entry.shell;
          if (!matchesAny(MASS_TEST, mass, shell.mass)) continue;
          if (!matchesAny(EXP_MASS_TEST, explosiveMass, shell.explosiveMass)) {
            continue;
          }
          if (!matchesAny(DAMAGE_TEST, damage, shell.damage)) continue;
          if (!matchesAny(PEN_TEST, penetration, shell.maxPenetration)) {
            continue;
          }
          if (!matchesAny(VEL_TEST, velocity, shell.velocity)) continue;
          if (input.laser && !shell.isLaser) continue;
          if (input.explosive && !shell.hasExplosive) continue;
          if (input.irccm && !shell.hasIRCCM) continue;
          if (input.unjammable && !shell.isUnjammable) continue;

          if (normalizedQuery) {
            const nameMatches = entry.simplifiedName.includes(normalizedQuery);
            const vehicleMatches = entry.simplifiedVehicles.some((v) =>
              v.includes(normalizedQuery),
            );
            if (!weaponMatchesQuery && !nameMatches && !vehicleMatches) {
              continue;
            }
          }

          matching.push(shell);
        }

        if (matching.length > 0) result[group.weapon] = matching;
      }

      return result;
    }),

  bySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string(),
      }),
    )
    .query(({ input }): DetailedShell | null => {
      const shells = getShells();
      const config = getConfig();

      const shellsPlace = shells.data[input.placeId as PlaceId];
      if (!shellsPlace) throw new TRPCError({ code: 'NOT_FOUND' });

      const [weapon, shellName] = shellsPlace.metadata.slugs[input.slug] || [
        null,
        null,
      ];
      if (!weapon || !shellName) return null;

      const shell = shellsPlace.data[weapon].find(
        (shell) => shell.name === shellName,
      )!;
      const initials =
        config.data.placeNameInitials[shellsPlace.metadata.placeName];
      const baseUrl = getBaseUrl();

      return {
        ...shell,
        weapon,
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
                name: weapon,
                item: new URL(
                  `${initials}/shells?q=${encodeURIComponent(weapon)}`,
                  baseUrl,
                ).toString(),
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: shell.name,
              },
            ],
          },
        },
      } as DetailedShell;
    }),
});
