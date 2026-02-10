// Disabled until https://github.com/vercel/next.js/issues/89768 is fixed

import { NextResponse } from 'next/server';
import slug from 'slug';

import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const vehicle = request.nextUrl.pathname.split('/')[3];
  if (vehicle) {
    const vehicleSlug = slug(decodeURIComponent(vehicle));
    if (vehicle !== vehicleSlug) {
      const url = request.nextUrl.clone();
      url.pathname = url.pathname.replace(vehicle, vehicleSlug);
      return NextResponse.redirect(url, 308);
    }
  }
}

export const config = {
  matcher: '/:place/vehicles/:vehicle',
};
