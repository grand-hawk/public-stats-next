import type {
  Update,
  UpdateBlock,
  UpdateMedia,
  UpdateSummary,
} from '@/server/utils/updates/types';

type Raw = Record<string, unknown>;

const asRecord = (value: unknown): Raw | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Raw)
    : null;

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

const asNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

function absolute(url: string, base?: string): string {
  if (!base || /^https?:\/\//.test(url)) return url;

  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

export function normaliseMedia(
  value: unknown,
  base?: string,
): UpdateMedia | undefined {
  const raw = asRecord(value);
  const url = asString(raw?.url);
  if (!raw || !url) return undefined;

  const poster = asRecord(raw.poster);
  const posterUrl = asString(poster?.url);

  return {
    url: absolute(url, base),
    mimeType: asString(raw.mimeType) ?? '',
    alt: asString(raw.alt) ?? '',
    width: asNumber(raw.width),
    height: asNumber(raw.height),
    poster: posterUrl ? absolute(posterUrl, base) : undefined,
  };
}

function normaliseBlock(value: unknown, base?: string): UpdateBlock | null {
  const raw = asRecord(value);
  if (!raw) return null;

  if (raw.blockType === 'prose') {
    const text = asString(raw.text);
    return text ? { kind: 'prose', text } : null;
  }

  if (raw.blockType === 'media') {
    const media = normaliseMedia(raw.file, base);
    if (!media) return null;

    return {
      kind: 'media',
      media,
      caption: asString(raw.caption),
      loop: raw.loop === true,
    };
  }

  return null;
}

export function normaliseSummary(value: unknown): UpdateSummary | null {
  const raw = asRecord(value);
  const slug = asString(raw?.slug);
  const title = asString(raw?.title);
  const date = asString(raw?.date);
  if (!raw || !slug || !title || !date) return null;

  return {
    slug,
    title,
    date,
    summary: asString(raw.summary),
  };
}

export function normaliseUpdate(value: unknown, base?: string): Update | null {
  const summary = normaliseSummary(value);
  const raw = asRecord(value);
  if (!summary || !raw) return null;

  const content = Array.isArray(raw.content) ? raw.content : [];

  return {
    ...summary,
    blocks: content
      .map((block) => normaliseBlock(block, base))
      .filter((block): block is UpdateBlock => block !== null),
    draft: raw._status !== 'published',
  };
}

export function normaliseList(value: unknown): UpdateSummary[] {
  const raw = asRecord(value);
  const docs = Array.isArray(raw?.docs) ? raw.docs : [];

  return docs
    .map((doc) => normaliseSummary(doc))
    .filter((update): update is UpdateSummary => update !== null);
}
