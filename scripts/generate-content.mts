import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

import slug from 'slug';
import { parse } from 'yaml';

import { getVehicles } from '@generated/vehicles';

import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';

const CONTENT_DIR = 'content/vehicles';
const CONFIG_PATH = 'content/config.yml';

const config = parse(await readFile(CONFIG_PATH, 'utf-8'));
const sections: { name: string }[] = config.vehicles.sections;
const body = sections.map((s) => `## ${s.name}\n`).join('\n');
const template = (name: string) => `# ${name}\n\n${body}`;

const vehicles = getVehicles();
const listedGameIds = new Set<string>();
const unlistedGameIds = new Set<string>();
const gameIdToName = new Map<string, string>();

for (const place of Object.values(vehicles.data)) {
  for (const [name, vehicle] of Object.entries(place.data) as [
    string,
    VehiclesPlaceDataVehicle,
  ][]) {
    const gameId = vehicle.info.gameId;
    if (vehicle.info.unlisted) {
      if (!listedGameIds.has(gameId)) unlistedGameIds.add(gameId);
      continue;
    }

    listedGameIds.add(gameId);
    unlistedGameIds.delete(gameId);
    gameIdToName.set(gameId, name);
  }
}

if (!existsSync(CONTENT_DIR)) await mkdir(CONTENT_DIR, { recursive: true });

let created = 0;
let skipped = 0;

for (const gameId of [...listedGameIds].sort()) {
  const filename = `${slug(gameId)}.md`;
  const filepath = `${CONTENT_DIR}/${filename}`;

  if (existsSync(filepath)) {
    skipped += 1;
    continue;
  }

  const displayName = gameIdToName.get(gameId) ?? gameId;
  await writeFile(filepath, template(displayName), 'utf-8');
  created += 1;
}

const expectedSlugs = new Set([...listedGameIds].map((id) => slug(id)));
const unlistedSlugs = new Set([...unlistedGameIds].map((id) => slug(id)));
const existingFiles = await readdir(CONTENT_DIR);
const extraFiles = existingFiles
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))
  .filter((s) => !expectedSlugs.has(s) && !unlistedSlugs.has(s));

if (extraFiles.length > 0) {
  console.warn(
    `Warning: ${extraFiles.length} file(s) in ${CONTENT_DIR} have no matching vehicle in the API:`,
  );
  for (const f of extraFiles.sort()) console.warn(`  - ${f}.md`);
}

console.log(`Done: ${created} created, ${skipped} skipped (already exist)`);
