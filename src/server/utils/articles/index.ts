import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { IS_DEV } from '@/env';
import { parseArticle } from '@/server/utils/articles/parse';

import type { ParsedArticle } from '@/server/utils/articles/parse';

export const ARTICLES_DIR = 'content/articles';
const ARTICLE_FILE = 'index.mdx';

export function readArticlesFromDisk(): ParsedArticle[] {
  if (!existsSync(ARTICLES_DIR)) return [];

  return readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(ARTICLES_DIR, entry.name, ARTICLE_FILE))
    .filter((filepath) => existsSync(filepath))
    .map((filepath) =>
      parseArticle(
        path.basename(path.dirname(filepath)),
        readFileSync(filepath, 'utf-8'),
      ),
    );
}

interface ArticleIndex {
  bySlug: Map<string, ParsedArticle>;
  aliases: Map<string, string>;
}

function buildIndex(): ArticleIndex {
  const bySlug = new Map<string, ParsedArticle>();
  const aliases = new Map<string, string>();

  for (const article of readArticlesFromDisk()) {
    if (article.meta.draft && !IS_DEV) continue;
    bySlug.set(article.slug, article);
    for (const alias of article.meta.aliases) aliases.set(alias, article.slug);
  }

  return { bySlug, aliases };
}

let cached: ArticleIndex | null = null;

function getIndex(): ArticleIndex {
  if (IS_DEV) return buildIndex();
  cached ??= buildIndex();
  return cached;
}

export function getArticle(slugOrAlias: string): ParsedArticle | null {
  const { aliases, bySlug } = getIndex();
  return bySlug.get(aliases.get(slugOrAlias) ?? slugOrAlias) ?? null;
}

export function listArticles(): ParsedArticle[] {
  return [...getIndex().bySlug.values()].sort(
    (a, b) =>
      a.meta.order - b.meta.order || a.meta.title.localeCompare(b.meta.title),
  );
}
