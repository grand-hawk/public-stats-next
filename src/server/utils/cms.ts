import { env } from '@/env';
import { createCache } from '@/server/utils/createCache';

const TIMEOUT_MS = 5_000;
const FRESH_SECONDS = 300;
const STALE_SECONDS = 3600;

export const hasCms = () => Boolean(env.CMS_URL);

async function request(path: string): Promise<unknown> {
  if (!env.CMS_URL) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${env.CMS_URL.replace(/\/+$/, '')}${path}`, {
      headers: env.CMS_TOKEN
        ? { authorization: `Bearer ${env.CMS_TOKEN}` }
        : undefined,
      signal: controller.signal,
    });

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const cache = createCache<string, unknown>(request, {
  maxAge: FRESH_SECONDS,
  staleWhileRevalidate: STALE_SECONDS,
});

export async function cmsGet(
  path: string,
  { fresh = false }: { fresh?: boolean } = {},
): Promise<unknown> {
  if (!env.CMS_URL) return null;
  if (fresh) return request(path);

  const cached = await cache.get(path);
  if (cached !== undefined) return cached;

  const fetched = await request(path);
  cache.set(path, fetched);

  return fetched;
}
