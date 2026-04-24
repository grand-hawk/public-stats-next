import slug from 'slug';

import { loadoutDisplayName } from '@/utils/loadoutDisplayName';
import { extractWikilinkRefs } from '@/utils/wikilinks';
import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { PageRef } from '@/components/common/pageIcon';
import type { PlaceId } from '@generated/config';

export interface RelatedPageItem {
  href: string;
  title: string;
  subtitle?: string;
  page: PageRef;
}

export function computeRelatedPages(
  description: string | undefined,
  placeId: PlaceId,
  initials: string,
): RelatedPageItem[] {
  if (!description) return [];

  const vehiclesPlace = getVehicles().data[placeId];
  const loadoutsPlace = getLoadouts().data[placeId];
  if (!vehiclesPlace || !loadoutsPlace) return [];

  const teamNames = new Set<string>(loadoutsPlace.metadata.teams);
  for (const vehicle of Object.values(vehiclesPlace.data)) {
    if (vehicle.info.team) teamNames.add(vehicle.info.team);
  }
  const playableTeamNames = new Set(loadoutsPlace.metadata.teams);
  const teamBySlug = new Map(
    [...teamNames].map((name) => [slug(name), name] as const),
  );
  const loadoutBySlug = new Map(
    loadoutsPlace.metadata.loadouts.map((name) => [slug(name), name] as const),
  );

  const items: RelatedPageItem[] = [];

  for (const ref of extractWikilinkRefs(description)) {
    const [, type, refSlug] = ref.path.split('/');
    if (!type || !refSlug) continue;
    const href = `/${initials}${ref.path}`;

    if (type === 'vehicles') {
      const vehicleName = vehiclesPlace.metadata.slugs[refSlug];
      if (!vehicleName) continue;
      const vehicle = vehiclesPlace.data[vehicleName];
      if (!vehicle || vehicle.info.unlisted) continue;
      items.push({
        href,
        title: vehicleName,
        subtitle: vehicle.info.role,
        page: { type: 'vehicle', name: vehicleName, slug: vehicle.info.slug },
      });
    } else if (type === 'teams') {
      const teamName = teamBySlug.get(refSlug);
      if (!teamName) continue;
      items.push({
        href,
        title: teamName,
        subtitle: playableTeamNames.has(teamName)
          ? 'Playable team'
          : 'Lore team',
        page: { type: 'team', name: teamName },
      });
    } else if (type === 'loadouts') {
      const loadoutName = loadoutBySlug.get(refSlug);
      if (!loadoutName) continue;
      const loadoutData = loadoutsPlace.data[loadoutName];
      items.push({
        href,
        title: loadoutDisplayName(loadoutName),
        subtitle: loadoutData?.description || undefined,
        page: { type: 'loadout', slug: refSlug },
      });
    }
  }

  return items;
}
