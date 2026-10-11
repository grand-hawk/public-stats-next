import { NextResponse } from 'next/server';
import slug from 'slug';

import { BRANCH_COOKIE } from '@/utils/branchCookie';
import { getNameFromInitials } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';

import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/((?!_next/|api/|md/|404|.*\\.).*)',
};

const slugifiedCollections = new Set([
  'vehicles',
  'teams',
  'loadouts',
  'shells',
]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let redirect = pathname.startsWith('/vehicles')
    ? `/mtc${pathname}`
    : pathname;

  const parts = redirect.split('/').filter(Boolean);
  if (parts.length >= 3 && slugifiedCollections.has(parts[parts.length - 2])) {
    const entry = decodeURIComponent(parts[parts.length - 1]);
    const slugified = slug(entry);
    if (entry !== slugified) {
      parts[parts.length - 1] = slugified;
      redirect = `/${parts.join('/')}`;
    }
  }

  if (redirect !== pathname) {
    return NextResponse.redirect(new URL(redirect, req.url), {
      status: 301,
      headers: { 'cache-control': 'public, max-age=86400' },
    });
  }

  const initials = pathname.split('/')[1];
  if (!initials) return;

  const { data } = getConfig();
  if (!getNameFromInitials(data, initials)) {
    return NextResponse.rewrite(new URL('/404', req.url), { status: 404 });
  }

  const [live] = Object.values(data.placeNameInitials);
  const branch = req.cookies.get(BRANCH_COOKIE)?.value;
  if (
    initials === live &&
    branch &&
    branch !== live &&
    getNameFromInitials(data, branch)
  ) {
    const url = req.nextUrl.clone();
    url.pathname = `/${branch}${pathname.slice(initials.length + 1)}`;
    return NextResponse.redirect(url, {
      status: 307,
      headers: { 'cache-control': 'private, no-store' },
    });
  }
}
