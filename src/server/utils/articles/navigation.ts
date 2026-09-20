import { existsSync, readFileSync } from 'node:fs';

import { parse as parseYaml } from 'yaml';

import { IS_DEV } from '@/env';
import { listArticles } from '@/server/utils/articles';

import type { ParsedArticle } from '@/server/utils/articles/parse';
import type { PlaceName } from '@generated/config';

export const NAVIGATION_PATH = 'content/navigation.yml';

export interface NavGroupConfig {
  key: string;
  label: string;
  tabs: string[];
}

export type NavLink =
  | { kind: 'tab'; tabKey: string }
  | {
      kind: 'article';
      slug: string;
      title: string;
      summary: string;
      nav: boolean;
    };

export interface NavGroup {
  key: string;
  label: string;
  links: NavLink[];
}

export function parseNavigation(raw: string): NavGroupConfig[] {
  const parsed = parseYaml(raw) as { groups?: unknown } | null;
  if (!Array.isArray(parsed?.groups)) return [];

  return parsed.groups.flatMap((group): NavGroupConfig[] => {
    if (typeof group?.key !== 'string' || typeof group?.label !== 'string') {
      return [];
    }

    return [
      {
        key: group.key,
        label: group.label,
        tabs: Array.isArray(group.tabs)
          ? group.tabs.filter(
              (tab: unknown): tab is string => typeof tab === 'string',
            )
          : [],
      },
    ];
  });
}

export function buildNavigation(
  groups: NavGroupConfig[],
  articles: ParsedArticle[],
): NavGroup[] {
  return groups.map(({ key, label, tabs }) => ({
    key,
    label,
    links: [
      ...tabs.map((tabKey): NavLink => ({ kind: 'tab', tabKey })),
      ...articles
        .filter((article) => article.meta.group === key)
        .map((article): NavLink => ({
          kind: 'article',
          slug: article.slug,
          title: article.meta.title,
          summary: article.meta.summary,
          nav: article.meta.nav,
        })),
    ],
  }));
}

let cachedGroups: NavGroupConfig[] | null = null;

export function getNavigationConfig(): NavGroupConfig[] {
  if (cachedGroups && !IS_DEV) return cachedGroups;

  cachedGroups = existsSync(NAVIGATION_PATH)
    ? parseNavigation(readFileSync(NAVIGATION_PATH, 'utf-8'))
    : [];
  return cachedGroups;
}

export function getNavigation(placeName?: PlaceName): NavGroup[] {
  return buildNavigation(getNavigationConfig(), listArticles(placeName));
}
