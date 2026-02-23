import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { parse } from 'yaml';

import { IS_DEV } from '@/env';

export type VehicleContent = Record<string, string>;

export interface VehicleMeta {
  frontArmorDepth?: number;
}

const CONTENT_DIR = 'content/vehicles';

function parseFrontmatter(raw: string): { body: string; meta: VehicleMeta } {
  if (!raw.startsWith('---\n')) return { body: raw, meta: {} };
  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) return { body: raw, meta: {} };

  const yamlText = raw.slice(4, end);
  const body = raw.slice(end + 5);

  try {
    const parsed = parse(yamlText) as Record<string, unknown>;
    return {
      body,
      meta: {
        frontArmorDepth:
          typeof parsed.frontArmorDepth === 'number'
            ? parsed.frontArmorDepth
            : undefined,
      },
    };
  } catch {
    return { body, meta: {} };
  }
}

function parseSections(raw: string): VehicleContent {
  const sections: VehicleContent = {};

  let currentSection: string | null = null;
  const lines: string[] = [];

  for (const line of raw.split('\n')) {
    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      if (currentSection) sections[currentSection] = lines.join('\n').trim();
      currentSection = h2[1].trim();
      lines.length = 0;
      continue;
    }

    if (!currentSection) continue;
    lines.push(line);
  }

  if (currentSection) sections[currentSection] = lines.join('\n').trim();

  return sections;
}

function parseFile(raw: string): {
  content: VehicleContent;
  meta: VehicleMeta;
} {
  const { body, meta } = parseFrontmatter(raw);
  return { content: parseSections(body), meta };
}

function readFromDisk(
  slug: string,
): { content: VehicleContent; meta: VehicleMeta } | null {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!existsSync(filepath)) return null;
  return parseFile(readFileSync(filepath, 'utf-8'));
}

const contentIndex = IS_DEV
  ? null
  : new Map<string, { content: VehicleContent; meta: VehicleMeta }>();

if (contentIndex) {
  for (const file of readdirSync(CONTENT_DIR)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    contentIndex.set(slug, parseFile(raw));
  }
}

export const getVehicleContent = (slug: string): VehicleContent | null => {
  const entry = IS_DEV ? readFromDisk(slug) : (contentIndex!.get(slug) ?? null);
  return entry?.content ?? null;
};

export const getVehicleMeta = (slug: string): VehicleMeta | null => {
  const entry = IS_DEV ? readFromDisk(slug) : (contentIndex!.get(slug) ?? null);
  return entry?.meta ?? null;
};
