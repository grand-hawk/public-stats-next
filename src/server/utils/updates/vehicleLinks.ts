import { normaliseTarget } from '@/utils/vehicleLink';
import { getVehicles } from '@generated/vehicles';

import type { UpdateBlock } from '@/server/utils/updates/types';
import type { PlaceId } from '@generated/config';

const TARGET = /\]\((?:<vehicle:([^>]+)>|vehicle:([^)]+))\)/g;

export const vehicleTargetsIn = (text: string): string[] => [
  ...new Set(
    [...text.matchAll(TARGET)]
      .map((match) => (match[1] ?? match[2]).trim())
      .filter(Boolean),
  ),
];

export function resolveVehicleLinks(
  blocks: UpdateBlock[],
  placeId: PlaceId,
): Record<string, string> {
  const targets = blocks.flatMap((block) =>
    block.kind === 'prose' ? vehicleTargetsIn(block.text) : [],
  );

  if (targets.length === 0) return {};

  const byGameId = new Map<string, string>();

  for (const vehicle of Object.values(
    getVehicles().data[placeId]?.data ?? {},
  )) {
    if (vehicle.info.unlisted) continue;

    byGameId.set(normaliseTarget(vehicle.info.gameId), vehicle.info.slug);
  }

  const links: Record<string, string> = {};

  for (const target of targets) {
    const key = normaliseTarget(target);
    const slug = byGameId.get(key);

    if (slug) links[key] = slug;
  }

  return links;
}
