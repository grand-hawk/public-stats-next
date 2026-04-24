import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { parse as parseYaml } from 'yaml';

import { IS_DEV } from '@/env';

export interface ContentEntry<Meta> {
  slug: string;
  meta: Meta;
  body: string;
}

interface CollectionOptions<Meta> {
  dir: string;
  parseMeta: (raw: Record<string, unknown>) => Meta;
}

function splitFrontmatter(raw: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  if (!raw.startsWith('---\n')) return { frontmatter: {}, body: raw };
  const end = raw.indexOf('\n---\n', 3);
  if (end === -1) return { frontmatter: {}, body: raw };

  const yamlText = raw.slice(4, end);
  const body = raw.slice(end + 5);

  try {
    const parsed = parseYaml(yamlText) as Record<string, unknown> | null;
    return { frontmatter: parsed ?? {}, body };
  } catch {
    return { frontmatter: {}, body };
  }
}

export function createContentCollection<Meta>({
  dir,
  parseMeta,
}: CollectionOptions<Meta>) {
  function parseEntry(slug: string, raw: string): ContentEntry<Meta> {
    const { body, frontmatter } = splitFrontmatter(raw);
    return { slug, meta: parseMeta(frontmatter), body: body.trim() };
  }

  function readFromDisk(slug: string): ContentEntry<Meta> | null {
    const filepath = path.join(dir, `${slug}.md`);
    if (!existsSync(filepath)) return null;
    return parseEntry(slug, readFileSync(filepath, 'utf-8'));
  }

  function readAllFromDisk(): ContentEntry<Meta>[] {
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const slug = f.replace(/\.md$/, '');
        return parseEntry(slug, readFileSync(path.join(dir, f), 'utf-8'));
      });
  }

  const index = IS_DEV ? null : new Map<string, ContentEntry<Meta>>();
  if (index) {
    for (const entry of readAllFromDisk()) index.set(entry.slug, entry);
  }

  return {
    get(slug: string): ContentEntry<Meta> | null {
      if (IS_DEV) return readFromDisk(slug);
      return index!.get(slug) ?? null;
    },
    list(): ContentEntry<Meta>[] {
      if (IS_DEV) return readAllFromDisk();
      return [...index!.values()];
    },
  };
}
