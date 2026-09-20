import { env } from '@/env';
import { cmsGet, hasCms } from '@/server/utils/cms';
import {
  normaliseList,
  normaliseUpdate,
} from '@/server/utils/updates/normalise';
import { resolveVehicleLinks } from '@/server/utils/updates/vehicleLinks';

import type {
  Update,
  UpdateSummary,
  UpdateView,
} from '@/server/utils/updates/types';
import type { PlaceId, PlaceName } from '@generated/config';

const LIST_LIMIT = 50;

const SUMMARY_FIELDS = ['slug', 'title', 'date', 'summary'];

const placeFilter = (placeName: PlaceName) =>
  `where[places][in]=${encodeURIComponent(placeName)}`;

const PUBLISHED = 'where[_status][equals]=published';

export async function fetchUpdates(
  placeName: PlaceName,
): Promise<UpdateSummary[]> {
  if (!hasCms()) return [];

  const select = SUMMARY_FIELDS.map((field) => `select[${field}]=true`).join(
    '&',
  );

  return normaliseList(
    await cmsGet(
      `/api/updates?${placeFilter(placeName)}&${PUBLISHED}&${select}&sort=-date&depth=1&limit=${LIST_LIMIT}`,
    ),
  );
}

type Neighbours = Pick<UpdateView, 'next' | 'previous'>;

async function neighbours(
  placeName: PlaceName,
  update: Update,
): Promise<Neighbours> {
  if (update.draft) return {};

  const updates = await fetchUpdates(placeName);
  const index = updates.findIndex((entry) => entry.slug === update.slug);
  if (index === -1) return {};

  return { next: updates[index - 1], previous: updates[index + 1] };
}

export async function fetchUpdate(
  placeName: PlaceName,
  placeId: PlaceId,
  slug: string,
  { preview = false }: { preview?: boolean } = {},
): Promise<UpdateView | null> {
  if (!hasCms()) return null;

  const query = [
    placeFilter(placeName),
    `where[slug][equals]=${encodeURIComponent(slug)}`,
    'depth=2',
    'limit=1',
    ...(preview ? ['draft=true'] : [PUBLISHED]),
  ].join('&');

  const payload = await cmsGet(`/api/updates?${query}`, { fresh: preview });
  const docs =
    typeof payload === 'object' && payload !== null
      ? (payload as { docs?: unknown }).docs
      : undefined;

  const first = Array.isArray(docs) ? docs[0] : undefined;
  const update = first ? normaliseUpdate(first, env.CMS_URL) : null;
  if (!update) return null;

  if (update.draft && !preview) return null;

  return {
    update,
    ...(await neighbours(placeName, update)),
    vehicles: resolveVehicleLinks(update.blocks, placeId),
  };
}
