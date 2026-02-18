import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { env } from '@/env';

export type VehicleContent = Record<string, string>;

const CONTENT_DIR = 'content/vehicles';
const isDev = env.NODE_ENV === 'development';

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

function readFromDisk(slug: string): VehicleContent | null {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!existsSync(filepath)) return null;
  return parseSections(readFileSync(filepath, 'utf-8'));
}

const contentIndex = isDev ? null : new Map<string, VehicleContent>();

if (contentIndex) {
  for (const file of readdirSync(CONTENT_DIR)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    contentIndex.set(slug, parseSections(raw));
  }
}

export const getVehicleContent = (slug: string): VehicleContent | null =>
  isDev ? readFromDisk(slug) : (contentIndex!.get(slug) ?? null);
