import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { createConsola } from 'consola';
import slug from 'slug';
import { parse } from 'yaml';

import { getVehicles } from '@generated/vehicles';

import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';

const CONTENT_DIR = 'content/vehicles';
const CONFIG_PATH = 'content/config.yml';

const consola = createConsola({ formatOptions: { date: false } });

const vehicles = getVehicles();
const gameIds = new Set<string>();
for (const place of Object.values(vehicles.data ?? {})) {
  const placeData = place?.data as
    | Record<string, VehiclesPlaceDataVehicle>
    | undefined;
  for (const vehicle of Object.values(placeData ?? {})) {
    if (vehicle?.info?.gameId) gameIds.add(vehicle.info.gameId);
  }
}
const expectedSlugs = new Set([...gameIds].map((id) => slug(id)));

interface ConfigSection {
  name: string;
  lineRule?: string;
}
const config = parse(await readFile(CONFIG_PATH, 'utf-8')) as {
  vehicles: { sections: ConfigSection[] };
};
const sections = config.vehicles.sections;
const allowedNames = sections.map((s: ConfigSection) => s.name);
const rulesByName = Object.fromEntries(
  sections
    .filter((s: ConfigSection) => s.lineRule)
    .map((s: ConfigSection) => [s.name, new RegExp(s.lineRule!)]),
);

let files = process.argv.slice(2);
if (files.length === 0) {
  const entries = await readdir(CONTENT_DIR);
  files = entries
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(CONTENT_DIR, f));
}

if (files.length === 0) {
  consola.info('No files to validate');
  process.exit(0);
}

consola.start(`Validating ${files.length} content files...`);

let hasErrors = false;

for (const filepath of files) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fileSlug = path.basename(filepath, '.md');
  if (!expectedSlugs.has(fileSlug)) {
    report(filepath, ['Vehicle no longer exists in API — delete this file']);
    continue;
  }

  let content: string;
  try {
    content = await readFile(filepath, 'utf-8');
  } catch {
    errors.push('File not found or unreadable');
    report(filepath, errors);
    continue;
  }

  // parse and validate frontmatter
  let body = content;
  let bodyLineOffset = 1;
  if (content.startsWith('---\n')) {
    const fmEnd = content.indexOf('\n---\n', 4);
    if (fmEnd === -1) {
      errors.push('Frontmatter block opened with --- but never closed');
    } else {
      const yamlText = content.slice(4, fmEnd);
      const bodySlice = content.slice(fmEnd + 5);
      body = bodySlice.trimStart();
      const firstBodyIdx = bodySlice.search(/\S/);
      const firstBodyCharPos =
        firstBodyIdx >= 0 ? fmEnd + 5 + firstBodyIdx : fmEnd + 5;
      bodyLineOffset =
        1 + (content.slice(0, firstBodyCharPos).match(/\n/g)?.length ?? 0);

      let parsedFm: Record<string, unknown> | undefined;
      try {
        parsedFm = parse(yamlText) as Record<string, unknown> | undefined;
      } catch (e) {
        errors.push(`Frontmatter YAML parse error: ${(e as Error).message}`);
      }

      if (parsedFm != null && typeof parsedFm === 'object') {
        const knownKeys = new Set(['frontArmorDepth']);
        for (const key of Object.keys(parsedFm)) {
          if (!knownKeys.has(key)) {
            errors.push(`Frontmatter: unknown key "${key}"`);
          }
        }

        if ('frontArmorDepth' in parsedFm) {
          const val = parsedFm.frontArmorDepth;
          if (typeof val !== 'number' || !Number.isFinite(val)) {
            errors.push(
              `frontArmorDepth must be a number, got ${JSON.stringify(val)}`,
            );
          } else if (val < 0 || val > 100) {
            errors.push(
              `frontArmorDepth must be between 0 and 100, got ${val}`,
            );
          }
        }
      }
    }
  }

  const lines = body.split('\n');
  const lineNum = (bodyLine: number) => bodyLineOffset + bodyLine - 1;

  // check for consecutive blank lines
  for (let i = 0; i < lines.length - 1; i += 1) {
    if (lines[i].trim() === '' && lines[i + 1].trim() === '') {
      errors.push(
        `Line ${lineNum(i + 2)}: consecutive blank lines are not allowed`,
      );
    }
  }

  // must start with an h1
  if (!lines[0]?.startsWith('# ') || lines[0].startsWith('## ')) {
    errors.push('File must start with a single # heading (vehicle name)');
  }

  const headings = lines
    .map((line, i) => ({ line, num: i + 1 }))
    .filter(({ line }) => /^#{1,6} /.test(line));

  // only one h1 allowed
  const h1s = headings.filter(({ line }) => /^# [^#]/.test(line));
  if (h1s.length > 1) {
    errors.push(
      `Only one # heading allowed, found ${h1s.length} (lines ${h1s.map((h) => lineNum(h.num)).join(', ')})`,
    );
  }

  // check ## sections (the only restricted heading level)
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

  // check all required sections are present
  for (const name of allowedNames) {
    if (!seenSections.has(name)) {
      errors.push(`Missing required section "## ${name}"`);
    }
  }

  // validate line rules and collect Description content
  let currentSection: string | null = null;
  const sectionContent = new Map<string, string[]>();
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const h2Match = line.match(/^## ([^#].*)$/);

    if (h2Match) {
      currentSection = h2Match[1].trim();
      continue;
    }

    // skip headings and blank lines
    if (/^#{1,6} /.test(line) || line.trim() === '') continue;

    // content outside of any ## section
    if (!currentSection) {
      errors.push(
        `Line ${lineNum(i + 1)}: content outside of a section — should be under a ## heading`,
      );
      continue;
    }

    const rule = rulesByName[currentSection];
    if (rule && !rule.test(line.trim())) {
      errors.push(
        `Line ${lineNum(i + 1)}: content in "${currentSection}" doesn't match required format — got "${line.trim()}"`,
      );
    }

    // range: left must be strictly less than right; standalone 0 not allowed
    if (rule && rule.test(line.trim())) {
      const trimmed = line.trim();
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
    sectionContent.get(currentSection)!.push(line.trim());
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

  report(filepath, errors, warnings);
}

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

if (hasErrors) {
  consola.fail('Content validation failed');
  process.exit(1);
} else consola.success(`Validated ${files.length} files`);
