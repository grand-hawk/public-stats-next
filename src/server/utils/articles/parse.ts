import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import slugify from 'slug';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { parse as parseYaml } from 'yaml';

import type { Root } from 'mdast';

export interface ArticleMeta {
  title: string;
  summary: string;
  group: string;
  order: number;
  nav: boolean;
  aliases: string[];
  places: string[];
  updated: string;
  draft: boolean;
}

export interface OutlineItem {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface ArticleLinkRef {
  slug: string;
  anchor?: string;
}

export interface ShellRef {
  name: string;
  weapon?: string;
}

export interface ArticleRefs {
  vehicles: string[];
  shells: ShellRef[];
  articles: ArticleLinkRef[];
  terms: string[];
  teams: string[];
  classes: string[];
}

export interface ArticleFigure {
  hasAlt: boolean;
  line: number;
}

export interface ParsedArticle {
  slug: string;
  meta: ArticleMeta;
  metaErrors: string[];
  outline: OutlineItem[];
  text: string;
  refs: ArticleRefs;
  figures: ArticleFigure[];
  bareImages: number[];
  leadHasBold: boolean;
}

interface JsxAttribute {
  type: string;
  name?: string;
  value?: string | { type: string; value: string } | null;
}

interface JsxNode {
  type: string;
  name: string | null;
  attributes: JsxAttribute[];
  position?: { start: { line: number } };
}

const STRING_LITERAL = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
const META_KEYS = new Set([
  'title',
  'summary',
  'group',
  'order',
  'nav',
  'aliases',
  'places',
  'updated',
  'draft',
]);

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkGfm)
  .use(remarkMdx);

export function shellRefKey({ name, weapon }: ShellRef): string {
  return weapon ? `${weapon}::${name}` : name;
}

function attributeStrings(node: JsxNode, name: string): string[] {
  const attribute = node.attributes.find(
    (candidate) =>
      candidate.type === 'mdxJsxAttribute' && candidate.name === name,
  );
  if (!attribute || attribute.value == null) return [];
  if (typeof attribute.value === 'string') return [attribute.value];

  return [...attribute.value.value.matchAll(STRING_LITERAL)].map(
    (match) => match[2],
  );
}

function hasAttribute(node: JsxNode, name: string): boolean {
  return attributeStrings(node, name).some((value) => value.trim().length > 0);
}

function parseMeta(raw: Record<string, unknown>): {
  meta: ArticleMeta;
  errors: string[];
} {
  const errors: string[] = [];

  for (const key of Object.keys(raw)) {
    if (!META_KEYS.has(key)) errors.push(`Frontmatter: unknown key "${key}"`);
  }

  const requireString = (key: 'title' | 'summary' | 'group') => {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    errors.push(`Frontmatter: "${key}" is required`);
    return '';
  };

  const title = requireString('title');
  const summary = requireString('summary');
  const group = requireString('group');

  let updated = '';
  if (raw.updated instanceof Date) {
    updated = raw.updated.toISOString().slice(0, 10);
  } else if (
    typeof raw.updated === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(raw.updated)
  ) {
    updated = raw.updated;
  } else errors.push('Frontmatter: "updated" must be a YYYY-MM-DD date');

  const places = Array.isArray(raw.places)
    ? raw.places.filter((place): place is string => typeof place === 'string')
    : [];
  if (raw.places !== undefined && !Array.isArray(raw.places)) {
    errors.push('Frontmatter: "places" must be a list');
  }

  const aliases = Array.isArray(raw.aliases)
    ? raw.aliases.filter((alias): alias is string => typeof alias === 'string')
    : [];
  if (raw.aliases !== undefined && !Array.isArray(raw.aliases)) {
    errors.push('Frontmatter: "aliases" must be a list');
  }

  return {
    meta: {
      title,
      summary,
      group,
      order: typeof raw.order === 'number' ? raw.order : 100,
      nav: raw.nav === true,
      aliases,
      places,
      updated,
      draft: raw.draft === true,
    },
    errors,
  };
}

function pushUnique<T>(list: T[], value: T, key: (item: T) => string) {
  if (list.some((item) => key(item) === key(value))) return;
  list.push(value);
}

export function parseArticle(slug: string, source: string): ParsedArticle {
  const raw = source.replace(/\r\n/g, '\n');
  const tree = processor.parse(raw) as Root;

  let frontmatter: Record<string, unknown> = {};
  const metaErrors: string[] = [];
  const outline: OutlineItem[] = [];
  const words: string[] = [];
  const figures: ArticleFigure[] = [];
  const bareImages: number[] = [];
  const refs: ArticleRefs = {
    vehicles: [],
    shells: [],
    articles: [],
    terms: [],
    teams: [],
    classes: [],
  };

  const same = (value: string) => value;

  visit(tree, (node) => {
    if (node.type === 'yaml') {
      try {
        frontmatter =
          (parseYaml(node.value) as Record<string, unknown> | null) ?? {};
      } catch (error) {
        metaErrors.push(
          `Frontmatter YAML parse error: ${(error as Error).message}`,
        );
      }
      return;
    }

    if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
      const parts: string[] = [];
      visit(node, (child) => {
        if (child.type === 'text' || child.type === 'inlineCode') {
          parts.push(child.value);
        }
      });
      const text = parts.join('').trim();
      outline.push({ depth: node.depth, text, id: slugify(text) });
      return;
    }

    if (node.type === 'text' || node.type === 'inlineCode') {
      words.push(node.value);
      return;
    }

    if (node.type === 'image') {
      bareImages.push(node.position?.start.line ?? 0);
      return;
    }

    if (
      node.type !== 'mdxJsxFlowElement' &&
      node.type !== 'mdxJsxTextElement'
    ) {
      return;
    }

    const element = node as unknown as JsxNode;
    switch (element.name) {
      case 'VehicleLink':
        for (const id of attributeStrings(element, 'id')) {
          pushUnique(refs.vehicles, id, same);
        }
        break;
      case 'ShellLink': {
        const [name] = attributeStrings(element, 'name');
        const [weapon] = attributeStrings(element, 'weapon');
        if (name) pushUnique(refs.shells, { name, weapon }, shellRefKey);
        break;
      }
      case 'WikiLink':
      case 'MainArticle':
        for (const target of attributeStrings(element, 'to')) {
          const [targetSlug, anchor] = target.split('#');
          pushUnique(
            refs.articles,
            { slug: targetSlug, anchor: anchor || undefined },
            (ref) => `${ref.slug}#${ref.anchor ?? ''}`,
          );
        }
        break;
      case 'Term':
        for (const id of attributeStrings(element, 'id')) {
          pushUnique(refs.terms, id, same);
        }
        break;
      case 'TeamLink':
        for (const name of attributeStrings(element, 'name')) {
          pushUnique(refs.teams, name, same);
        }
        break;
      case 'ClassLink':
        for (const name of attributeStrings(element, 'name')) {
          pushUnique(refs.classes, name, same);
        }
        break;
      case 'Figure':
        figures.push({
          hasAlt: hasAttribute(element, 'alt'),
          line: element.position?.start.line ?? 0,
        });
        for (const caption of attributeStrings(element, 'caption')) {
          words.push(caption);
        }
        break;
      default:
        break;
    }
  });

  const lead = tree.children.find((node) => node.type === 'paragraph');
  const leadHasBold =
    lead?.type === 'paragraph' &&
    lead.children.some((child) => child.type === 'strong');

  const { errors, meta } = parseMeta(frontmatter);

  return {
    slug,
    meta,
    metaErrors: [...metaErrors, ...errors],
    outline,
    text: words.join(' ').replace(/\s+/g, ' ').trim(),
    refs,
    figures,
    bareImages,
    leadHasBold,
  };
}
