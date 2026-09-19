import { existsSync, readFileSync } from 'node:fs';

import slugify from 'slug';
import { parse as parseYaml } from 'yaml';

import { IS_DEV } from '@/env';

export const GLOSSARY_PATH = 'content/glossary.yml';
export const GLOSSARY_SLUG = 'glossary';

export interface GlossaryTerm {
  id: string;
  label: string;
  definition: string;
  section: string;
  anchor: string;
  article?: string;
}

export function parseGlossary(raw: string): GlossaryTerm[] {
  const parsed = parseYaml(raw) as { terms?: unknown } | null;
  if (!Array.isArray(parsed?.terms)) return [];

  return parsed.terms.flatMap((term): GlossaryTerm[] => {
    if (
      typeof term?.id !== 'string' ||
      typeof term?.label !== 'string' ||
      typeof term?.definition !== 'string' ||
      typeof term?.section !== 'string'
    ) {
      return [];
    }

    return [
      {
        id: term.id,
        label: term.label,
        definition: term.definition.trim(),
        section: term.section,
        anchor: slugify(term.label),
        article: typeof term.article === 'string' ? term.article : undefined,
      },
    ];
  });
}

let cached: GlossaryTerm[] | null = null;

export function getGlossary(): GlossaryTerm[] {
  if (cached && !IS_DEV) return cached;

  cached = existsSync(GLOSSARY_PATH)
    ? parseGlossary(readFileSync(GLOSSARY_PATH, 'utf-8'))
    : [];
  return cached;
}
