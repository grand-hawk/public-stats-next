import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_LENGTH = 16;

export const previewToken = (slug: string, secret: string): string =>
  createHmac('sha256', secret)
    .update(slug)
    .digest('hex')
    .slice(0, TOKEN_LENGTH);

export function isPreviewAuthorised(
  provided: string | undefined,
  slug: string | undefined,
  secret: string | undefined,
): boolean {
  if (!provided || !slug || !secret) return false;

  const expected = Buffer.from(previewToken(slug, secret));
  const given = Buffer.from(provided);

  return expected.length === given.length && timingSafeEqual(expected, given);
}
