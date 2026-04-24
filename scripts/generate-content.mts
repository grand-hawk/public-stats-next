import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

import slug from 'slug';
import { parse } from 'yaml';

import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';

const VEHICLES_DIR = 'content/vehicles';
const TEAMS_DIR = 'content/teams';
const LOADOUTS_DIR = 'content/loadouts';
const CONFIG_PATH = 'content/config.yml';

function splitFrontmatter(raw: string): { header: string; body: string } {
  if (!raw.startsWith('---\n')) return { header: '', body: raw };
  const end = raw.indexOf('\n---\n', 3);
  if (end === -1) return { header: '', body: raw };
  return { header: raw.slice(0, end + 5), body: raw.slice(end + 5) };
}

function titleizeSlug(s: string): string {
  return s
    .split('-')
    .map((part) => {
      if (part.length === 0) return part;
      if (part.length <= 3) return part.toUpperCase();
      return part[0].toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');
}

function withLeadingH1(raw: string, name: string): string {
  const { body, header } = splitFrontmatter(raw);
  const leadingGap = header ? '\n' : '';
  let nextBody = body.replace(/^\s+/, '');

  if (!/^\s*# \S/.test(nextBody)) {
    const sep = nextBody.length > 0 ? '\n\n' : '';
    nextBody = `# ${name}\n${sep}${nextBody}`;
  }

  nextBody = nextBody.replace(/^(# [^\n]*)\n+(?=\S)/m, '$1\n\n');
  if (/^# [^\n]*\n*$/.test(nextBody)) {
    nextBody = nextBody.replace(/\n*$/, '\n');
  }

  const next = `${header}${leadingGap}${nextBody}`;
  return next === raw ? raw : next;
}

interface SyncStats {
  created: number;
  updated: number;
  skipped: number;
  orphans: number;
}

interface SyncOptions {
  dir: string;
  kind: string;
  names: Iterable<string>;
  initialContent: (name: string) => string;
  refreshExisting?: boolean;
  orphanExempt?: Set<string>;
  orphanRefreshTitle?: (slug: string) => string;
}

async function syncCollection(opts: SyncOptions): Promise<SyncStats> {
  const {
    dir,
    initialContent,
    kind,
    names,
    orphanExempt,
    orphanRefreshTitle,
    refreshExisting = false,
  } = opts;

  if (!existsSync(dir)) await mkdir(dir, { recursive: true });

  const expected = new Set<string>();
  const stats: SyncStats = { created: 0, updated: 0, skipped: 0, orphans: 0 };

  for (const name of [...names].sort()) {
    const fileSlug = slug(name);
    expected.add(fileSlug);
    const filepath = `${dir}/${fileSlug}.md`;

    if (!existsSync(filepath)) {
      await writeFile(filepath, initialContent(name), 'utf-8');
      stats.created += 1;
      continue;
    }

    if (refreshExisting) {
      const existing = await readFile(filepath, 'utf-8');
      const next = withLeadingH1(existing, name);
      if (next !== existing) {
        await writeFile(filepath, next, 'utf-8');
        stats.updated += 1;
        continue;
      }
    }
    stats.skipped += 1;
  }

  const entries = await readdir(dir);
  const orphans = entries
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((s) => !expected.has(s) && !orphanExempt?.has(s));

  if (orphanRefreshTitle) {
    for (const orphanSlug of orphans) {
      const filepath = `${dir}/${orphanSlug}.md`;
      const existing = await readFile(filepath, 'utf-8');
      const next = withLeadingH1(existing, orphanRefreshTitle(orphanSlug));
      if (next !== existing) {
        await writeFile(filepath, next, 'utf-8');
        stats.updated += 1;
      }
    }
  }

  stats.orphans = orphans.length;
  if (orphans.length > 0) {
    console.warn(
      `Warning: ${orphans.length} file(s) in ${dir} have no matching ${kind} in the API:`,
    );
    for (const f of orphans.sort()) console.warn(`  - ${f}.md`);
  }

  return stats;
}

const config = parse(await readFile(CONFIG_PATH, 'utf-8'));
const sections: { name: string }[] = config.vehicles.sections;
const vehicleBody = sections.map((s) => `## ${s.name}\n`).join('\n');
const vehicleTemplate = (name: string) => `# ${name}\n\n${vehicleBody}`;

const listedGameIds = new Set<string>();
const unlistedGameIds = new Set<string>();
const gameIdToName = new Map<string, string>();
const teamNames = new Set<string>();
const playableTeamNames = new Set<string>();
const loadoutNames = new Set<string>();

for (const place of Object.values(getVehicles().data)) {
  for (const [name, vehicle] of Object.entries(place.data) as [
    string,
    VehiclesPlaceDataVehicle,
  ][]) {
    const gameId = vehicle.info.gameId;
    if (vehicle.info.unlisted) {
      if (!listedGameIds.has(gameId)) unlistedGameIds.add(gameId);
    } else {
      listedGameIds.add(gameId);
      unlistedGameIds.delete(gameId);
      gameIdToName.set(gameId, name);
    }
    if (vehicle.info.team) teamNames.add(vehicle.info.team);
  }
}

for (const place of Object.values(getLoadouts().data)) {
  for (const team of place.metadata.teams) {
    teamNames.add(team);
    playableTeamNames.add(team);
  }
  for (const loadoutName of place.metadata.loadouts) {
    loadoutNames.add(loadoutName);
  }
}

const unlistedVehicleSlugs = new Set(
  [...unlistedGameIds].map((id) => slug(id)),
);

const vehicleStats = await syncCollection({
  dir: VEHICLES_DIR,
  kind: 'vehicle',
  names: listedGameIds,
  initialContent: (gameId) =>
    vehicleTemplate(gameIdToName.get(gameId) ?? gameId),
  orphanExempt: unlistedVehicleSlugs,
});

const teamStats = await syncCollection({
  dir: TEAMS_DIR,
  kind: 'team',
  names: teamNames,
  initialContent: (name) => {
    const frontmatter = playableTeamNames.has(name)
      ? ''
      : '---\nlore: true\n---\n\n';
    return `${frontmatter}# ${name}\n`;
  },
  refreshExisting: true,
  orphanRefreshTitle: titleizeSlug,
});

const loadoutStats = await syncCollection({
  dir: LOADOUTS_DIR,
  kind: 'loadout',
  names: loadoutNames,
  initialContent: (name) => `# ${name}\n`,
  refreshExisting: true,
  orphanRefreshTitle: titleizeSlug,
});

const summary = (label: string, s: SyncStats) =>
  `${label} ${s.created} created / ${s.updated} updated / ${s.skipped} skipped`;

console.log(
  `Done: ${summary('vehicles', vehicleStats)}; ${summary('teams', teamStats)}; ${summary('loadouts', loadoutStats)}`,
);
