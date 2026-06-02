import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { createConsola } from 'consola';
import slug from 'slug';
import { parse } from 'yaml';

import { getLoadouts } from '@generated/loadouts';
import { getVehicles } from '@generated/vehicles';

import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';

const VEHICLES_DIR = 'content/vehicles';
const TEAMS_DIR = 'content/teams';
const LOADOUTS_DIR = 'content/loadouts';
const CONFIG_PATH = 'content/config.yml';

const consola = createConsola({ formatOptions: { date: false } });

const listedGameIds = new Set<string>();
const unlistedGameIds = new Set<string>();
const validVehicleSlugs = new Set<string>();
const validTeamSlugs = new Set<string>();
const validLoadoutSlugs = new Set<string>();

for (const place of Object.values(getVehicles().data ?? {})) {
  const placeData = place?.data as
    | Record<string, VehiclesPlaceDataVehicle>
    | undefined;
  for (const vehicle of Object.values(placeData ?? {})) {
    if (!vehicle?.info?.gameId) continue;
    const { gameId, team, unlisted } = vehicle.info;
    if (unlisted) {
      if (!listedGameIds.has(gameId)) unlistedGameIds.add(gameId);
    } else {
      listedGameIds.add(gameId);
      unlistedGameIds.delete(gameId);
    }
    if (team) validTeamSlugs.add(slug(team));
  }
  for (const urlSlug of Object.keys(place?.metadata?.slugs ?? {})) {
    validVehicleSlugs.add(urlSlug);
  }
}

for (const place of Object.values(getLoadouts().data ?? {})) {
  for (const team of place?.metadata?.teams ?? []) {
    validTeamSlugs.add(slug(team));
  }
  for (const loadout of place?.metadata?.loadouts ?? []) {
    validLoadoutSlugs.add(slug(loadout));
  }
}

const expectedSlugs = new Set([...listedGameIds].map((id) => slug(id)));
const unlistedSlugs = new Set([...unlistedGameIds].map((id) => slug(id)));

const WIKILINK_ANY = /\[\[([^\]\n]+)\]\]/g;
const WIKILINK_FULL =
  /^(\/(?:vehicles|teams|loadouts))\/([a-z0-9-]+)(?:\s+([^\]\n]+))?$/;
const slugSetByType: Record<string, Set<string>> = {
  vehicles: validVehicleSlugs,
  teams: validTeamSlugs,
  loadouts: validLoadoutSlugs,
};

function validateWikilinks(body: string, bodyLineOffset: number): string[] {
  const errors: string[] = [];
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    for (const match of lines[i].matchAll(WIKILINK_ANY)) {
      const inner = match[1];
      const full = inner.match(WIKILINK_FULL);
      const ln = bodyLineOffset + i;
      if (!full) {
        errors.push(
          `Line ${ln}: malformed wikilink "[[${inner}]]" — expected "[[/vehicles|/teams|/loadouts/<slug> Label]]"`,
        );
        continue;
      }
      const [, typePath, refSlug] = full;
      const type = typePath.slice(1);
      if (!slugSetByType[type].has(refSlug)) {
        errors.push(
          `Line ${ln}: wikilink "[[${typePath}/${refSlug}]]" points to unknown ${type.replace(/s$/, '')} slug "${refSlug}"`,
        );
      }
    }
  }
  return errors;
}

interface ParsedFile {
  body: string;
  bodyLineOffset: number;
  frontmatter?: Record<string, unknown>;
  errors: string[];
}

function parseFile(content: string): ParsedFile {
  if (!content.startsWith('---\n')) {
    return { body: content, bodyLineOffset: 1, errors: [] };
  }
  const fmEnd = content.indexOf('\n---\n', 4);
  if (fmEnd === -1) {
    return {
      body: content,
      bodyLineOffset: 1,
      errors: ['Frontmatter block opened with --- but never closed'],
    };
  }

  const yamlText = content.slice(4, fmEnd);
  const bodySlice = content.slice(fmEnd + 5);
  const body = bodySlice.trimStart();
  const firstBodyIdx = bodySlice.search(/\S/);
  const firstBodyCharPos =
    firstBodyIdx >= 0 ? fmEnd + 5 + firstBodyIdx : fmEnd + 5;
  const bodyLineOffset =
    1 + (content.slice(0, firstBodyCharPos).match(/\n/g)?.length ?? 0);

  const errors: string[] = [];
  let frontmatter: Record<string, unknown> | undefined;
  try {
    frontmatter = parse(yamlText) as Record<string, unknown> | undefined;
  } catch (e) {
    errors.push(`Frontmatter YAML parse error: ${(e as Error).message}`);
  }
  return { body, bodyLineOffset, frontmatter, errors };
}

interface ConfigSection {
  name: string;
  lineRule?: string;
}
const config = parse(await readFile(CONFIG_PATH, 'utf-8')) as {
  vehicles: { sections: ConfigSection[] };
};
const allowedNames = config.vehicles.sections.map((s) => s.name);
const rulesByName = Object.fromEntries(
  config.vehicles.sections
    .filter((s) => s.lineRule)
    .map((s) => [s.name, new RegExp(s.lineRule!)]),
);

async function readMdDir(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir);
    return entries
      .filter((f) => f.endsWith('.md'))
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

const argFiles = process.argv.slice(2);
let vehicleFiles: string[];
let simpleFiles: string[];

if (argFiles.length === 0) {
  vehicleFiles = await readMdDir(VEHICLES_DIR);
  simpleFiles = [
    ...(await readMdDir(TEAMS_DIR)),
    ...(await readMdDir(LOADOUTS_DIR)),
  ];
} else {
  vehicleFiles = [];
  simpleFiles = [];
  for (const f of argFiles) {
    if (f.includes(TEAMS_DIR) || f.includes(LOADOUTS_DIR)) simpleFiles.push(f);
    else vehicleFiles.push(f);
  }
}
vehicleFiles = vehicleFiles.filter(
  (f) => !unlistedSlugs.has(path.basename(f, '.md')),
);

const totalFiles = vehicleFiles.length + simpleFiles.length;
if (totalFiles === 0) {
  consola.info('No files to validate');
  process.exit(0);
}

consola.start(`Validating ${totalFiles} content files...`);

let hasErrors = false;

function report(
  filepath: string,
  errors: string[],
  warnings: string[] = [],
): void {
  if (errors.length > 0) {
    hasErrors = true;
    consola.error(`${filepath}:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  }
  if (warnings.length > 0) {
    consola.warn(`${filepath}:\n${warnings.map((w) => `  - ${w}`).join('\n')}`);
  }
}

async function readOrReport(filepath: string): Promise<string | null> {
  try {
    return await readFile(filepath, 'utf-8');
  } catch {
    report(filepath, ['File not found or unreadable']);
    return null;
  }
}

for (const filepath of vehicleFiles) {
  const fileSlug = path.basename(filepath, '.md');
  if (!expectedSlugs.has(fileSlug)) {
    report(filepath, ['Vehicle no longer exists in API — delete this file']);
    continue;
  }

  const content = await readOrReport(filepath);
  if (content === null) continue;

  const errors: string[] = [];
  const warnings: string[] = [];
  const parsed = parseFile(content);
  errors.push(...parsed.errors);
  const { body, bodyLineOffset, frontmatter } = parsed;
  const lineNum = (bodyLine: number) => bodyLineOffset + bodyLine - 1;

  if (frontmatter) {
    const knownKeys = new Set(['frontArmorDepth']);
    for (const key of Object.keys(frontmatter)) {
      if (!knownKeys.has(key)) errors.push(`Frontmatter: unknown key "${key}"`);
    }
    if ('frontArmorDepth' in frontmatter) {
      const val = frontmatter.frontArmorDepth;
      if (typeof val !== 'number' || !Number.isFinite(val)) {
        errors.push(
          `frontArmorDepth must be a number, got ${JSON.stringify(val)}`,
        );
      } else if (val < 0 || val > 100) {
        errors.push(`frontArmorDepth must be between 0 and 100, got ${val}`);
      }
    }
  }

  const lines = body.split('\n');

  for (let i = 0; i < lines.length - 1; i += 1) {
    if (lines[i].trim() === '' && lines[i + 1].trim() === '') {
      errors.push(
        `Line ${lineNum(i + 2)}: consecutive blank lines are not allowed`,
      );
    }
  }

  if (!lines[0]?.startsWith('# ') || lines[0].startsWith('## ')) {
    errors.push('File must start with a single # heading (vehicle name)');
  }

  const headings = lines
    .map((line, i) => ({ line, num: i + 1 }))
    .filter(({ line }) => /^#{1,6} /.test(line));
  const h1s = headings.filter(({ line }) => /^# [^#]/.test(line));
  if (h1s.length > 1) {
    errors.push(
      `Only one # heading allowed, found ${h1s.length} (lines ${h1s.map((h) => lineNum(h.num)).join(', ')})`,
    );
  }

  const h2s = headings.filter(({ line }) => /^## [^#]/.test(line));
  const seenSections = new Map<string, number>();
  for (const { line, num } of h2s) {
    const sectionName = line.replace(/^## /, '').trim();
    if (!allowedNames.includes(sectionName)) {
      errors.push(
        `Line ${lineNum(num)}: unknown section "## ${sectionName}" (allowed: ${allowedNames.join(', ')})`,
      );
    }
    if (seenSections.has(sectionName)) {
      errors.push(
        `Line ${lineNum(num)}: duplicate section "## ${sectionName}" (first at line ${seenSections.get(sectionName)!})`,
      );
    } else seenSections.set(sectionName, num);
  }
  for (const name of allowedNames) {
    if (!seenSections.has(name)) {
      errors.push(`Missing required section "## ${name}"`);
    }
  }

  let currentSection: string | null = null;
  const sectionContent = new Map<string, string[]>();
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const h2Match = line.match(/^## ([^#].*)$/);
    if (h2Match) {
      currentSection = h2Match[1].trim();
      continue;
    }
    if (/^#{1,6} /.test(line) || line.trim() === '') continue;
    if (!currentSection) {
      errors.push(
        `Line ${lineNum(i + 1)}: content outside of a section — should be under a ## heading`,
      );
      continue;
    }

    const trimmed = line.trim();
    const rule = rulesByName[currentSection];
    if (rule && !rule.test(trimmed)) {
      errors.push(
        `Line ${lineNum(i + 1)}: content in "${currentSection}" doesn't match required format — got "${trimmed}"`,
      );
    }

    if (rule && rule.test(trimmed)) {
      const rangeMatch = trimmed.match(/:\s*(~?\d+)-(~?\d+)$/);
      if (rangeMatch) {
        const left = parseInt(rangeMatch[1].replace('~', ''), 10);
        const right = parseInt(rangeMatch[2].replace('~', ''), 10);
        if (left >= right) {
          errors.push(
            `Line ${lineNum(i + 1)}: armour range must have left < right, got ${rangeMatch[1]}-${rangeMatch[2]}`,
          );
        }
      } else if (currentSection === 'Armour') {
        const singleMatch = trimmed.match(/:\s*(~?\d+)$/);
        if (
          singleMatch &&
          parseInt(singleMatch[1].replace('~', ''), 10) === 0
        ) {
          errors.push(
            `Line ${lineNum(i + 1)}: armour cannot be standalone 0 (use 0-5 for a range if needed)`,
          );
        }
      }
    }

    if (!sectionContent.has(currentSection)) {
      sectionContent.set(currentSection, []);
    }
    sectionContent.get(currentSection)!.push(trimmed);
  }

  const vehicleName = lines[0]?.replace(/^# /, '').trim() ?? '';
  const descriptionText = sectionContent.get('Description')?.join(' ') ?? '';
  if (
    vehicleName &&
    descriptionText.trim() &&
    !descriptionText.toLowerCase().includes(vehicleName.toLowerCase())
  ) {
    errors.push(
      `Description must mention the vehicle name "${vehicleName}" when not empty`,
    );
  }
  if (!descriptionText.trim()) warnings.push('Description section is empty');
  const armourContent = sectionContent.get('Armour')?.join(' ') ?? '';
  if (!armourContent.trim()) warnings.push('Armour section is empty');

  errors.push(...validateWikilinks(body, bodyLineOffset));
  report(filepath, errors, warnings);
}

for (const filepath of simpleFiles) {
  const content = await readOrReport(filepath);
  if (content === null) continue;
  const { body, bodyLineOffset, errors } = parseFile(content);
  errors.push(...validateWikilinks(body, bodyLineOffset));
  report(filepath, errors);
}

if (hasErrors) {
  consola.fail('Content validation failed');
  process.exit(1);
}
consola.success(`Validated ${totalFiles} files`);
