import fs from 'node:fs';
import path from 'node:path';

import { TRPCError } from '@trpc/server';
import slug from 'slug';

import { getVehicles } from '@generated/vehicles';

function resolveContentSlug(vehicleSlug: string): string | null {
  for (const place of Object.values(getVehicles().data)) {
    const vehicleName = place.metadata.slugs[vehicleSlug];
    if (vehicleName) return slug(place.data[vehicleName].info.gameId);
  }
  return null;
}

export function setFrontArmorDepth(vehicleSlug: string, value: number): void {
  const contentSlug = resolveContentSlug(vehicleSlug);
  if (!contentSlug) throw new TRPCError({ code: 'NOT_FOUND' });

  const filepath = path.join('content/vehicles', `${contentSlug}.md`);
  if (!fs.existsSync(filepath)) throw new TRPCError({ code: 'NOT_FOUND' });

  const raw = fs.readFileSync(filepath, 'utf-8');
  const fmEnd = raw.startsWith('---\n') ? raw.indexOf('\n---\n', 4) : -1;
  const body = fmEnd !== -1 ? raw.slice(fmEnd + 5) : raw;
  fs.writeFileSync(
    filepath,
    `---\nfrontArmorDepth: ${Math.round(value)}\n---\n\n${body.trimStart()}`,
    'utf-8',
  );
}
