import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

import ky from 'ky';
import slug from 'slug';
import { parse } from 'yaml';

import type { Vehicles, VehiclesPlaceDataVehicle } from '@generated/vehicles';

const CONTENT_DIR = 'content/vehicles';
const CONFIG_PATH = 'content/config.yml';

const config = parse(await readFile(CONFIG_PATH, 'utf-8'));
const sections: { name: string }[] = config.sections;
const body = sections.map((s) => `## ${s.name}\n`).join('\n');
const template = (name: string) => `# ${name}\n\n${body}`;

const environment =
  process.env.DATA_ENV || process.env.NODE_ENV || 'development';
const prefixUrl = `https://public-stats-data.multicrew.dev/${environment}/1.0.0`;

const vehicles = await ky.get(`${prefixUrl}/vehicles.json`).json<Vehicles>();
const gameIds = new Set<string>();

for (const place of Object.values(vehicles.data)) {
  for (const vehicle of Object.values(place.data) as VehiclesPlaceDataVehicle[])
    gameIds.add(vehicle.info.gameId);
}

if (!existsSync(CONTENT_DIR)) await mkdir(CONTENT_DIR, { recursive: true });

let created = 0;
let skipped = 0;

for (const gameId of [...gameIds].sort()) {
  const filename = `${slug(gameId)}.md`;
  const filepath = `${CONTENT_DIR}/${filename}`;

  if (existsSync(filepath)) {
    skipped += 1;
    continue;
  }

  await writeFile(filepath, template(gameId), 'utf-8');
  created += 1;
}

const expectedSlugs = new Set([...gameIds].map((id) => slug(id)));
const existingFiles = await readdir(CONTENT_DIR);
const extraFiles = existingFiles
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))
  .filter((s) => !expectedSlugs.has(s));

if (extraFiles.length > 0) {
  console.warn(
    `Warning: ${extraFiles.length} file(s) in ${CONTENT_DIR} have no matching vehicle in the API:`
  );
  for (const f of extraFiles.sort()) {
    console.warn(`  - ${f}.md`);
  }
}

console.log(`Done: ${created} created, ${skipped} skipped (already exist)`);
