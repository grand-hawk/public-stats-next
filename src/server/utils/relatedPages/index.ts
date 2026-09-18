import { IS_DEV } from '@/env';
import { buildVectors, cosine } from '@/server/utils/relatedPages/similarity';
import { collectSources } from '@/server/utils/relatedPages/sources';
import { extractWikilinkRefs } from '@/utils/wikilinks';

import type { PageRef } from '@/components/common/pageIcon';
import type { TermVector } from '@/server/utils/relatedPages/similarity';
import type { PageSource } from '@/server/utils/relatedPages/sources';
import type { PlaceId } from '@generated/config';

export type RelatedReason = 'linked' | 'backlink' | 'similar';

export interface RelatedPageItem {
  href: string;
  title: string;
  reason: RelatedReason;
  page: PageRef;
}

interface IndexedPage extends Omit<PageSource, 'body' | 'keywords'> {
  outbound: string[];
  vector: TermVector;
}

interface PageIndex {
  byPath: Map<string, IndexedPage>;
  backlinks: Map<string, string[]>;
}

const RELATED_LIMIT = 6;

const REASON_RANK: Record<RelatedReason, number> = {
  linked: 0,
  backlink: 1,
  similar: 2,
};

function buildIndex(placeId: PlaceId): PageIndex {
  const sources = collectSources(placeId);
  const vectors = buildVectors(
    sources.map(({ body, keywords, title }) => `${title} ${keywords} ${body}`),
  );

  const byPath = new Map<string, IndexedPage>();
  sources.forEach(({ body, page, path, title }, position) => {
    byPath.set(path, {
      path,
      title,
      page,
      outbound: extractWikilinkRefs(body).map((ref) => ref.path),
      vector: vectors[position]!,
    });
  });

  const backlinks = new Map<string, string[]>();
  for (const page of byPath.values()) {
    for (const target of page.outbound) {
      if (!byPath.has(target)) continue;
      backlinks.set(target, [...(backlinks.get(target) ?? []), page.path]);
    }
  }

  return { byPath, backlinks };
}

const indexCache = new Map<PlaceId, PageIndex>();

function getIndex(placeId: PlaceId): PageIndex {
  if (IS_DEV) return buildIndex(placeId);

  const cached = indexCache.get(placeId);
  if (cached) return cached;

  const index = buildIndex(placeId);
  indexCache.set(placeId, index);
  return index;
}

export function computeRelatedPages(
  placeId: PlaceId,
  initials: string,
  selfPath: string,
): RelatedPageItem[] {
  const { backlinks, byPath } = getIndex(placeId);
  const self = byPath.get(selfPath);
  if (!self) return [];

  const candidates = new Map<
    string,
    { reason: RelatedReason; order: number }
  >();

  const consider = (path: string, reason: RelatedReason, order: number) => {
    if (path === selfPath || !byPath.has(path)) return;

    const existing = candidates.get(path);
    if (existing && REASON_RANK[existing.reason] <= REASON_RANK[reason]) return;

    candidates.set(path, { reason, order });
  };

  self.outbound.forEach((path, position) => consider(path, 'linked', position));

  (backlinks.get(selfPath) ?? []).forEach((path, position) =>
    consider(path, 'backlink', position),
  );

  for (const candidate of byPath.values()) {
    const score = cosine(self.vector, candidate.vector);
    if (score > 0) consider(candidate.path, 'similar', -score);
  }

  return [...candidates.entries()]
    .sort(
      ([, a], [, b]) =>
        REASON_RANK[a.reason] - REASON_RANK[b.reason] || a.order - b.order,
    )
    .slice(0, RELATED_LIMIT)
    .map(([path, { reason }]) => {
      const page = byPath.get(path)!;

      return {
        href: `/${initials}${path}`,
        title: page.title,
        reason,
        page: page.page,
      };
    });
}
