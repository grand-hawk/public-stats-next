import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { env } from '@/env';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';
import { getBaseUrl } from '@/utils/trpc';

import type { Place } from '@/utils/placeUtils';

export const getKeywords = (place: Place) => [
  place.placeName,
  place.initials.toUpperCase(),
  'Statistics',
  'Stats',
  'Data',
];

export default function InternalHead() {
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();
  const router = useRouter();
  const canonicalUrl = `${getBaseUrl()}${router.asPath.split('?')[0]}`;

  return (
    <Head>
      <title>{formatTitle(currentTab?.label, initials)}</title>
      <link href="/favicon.ico" rel="icon" type="image/x-icon" />

      <meta content="website" property="og:type" />
      <meta content="index,follow" name="robots" />
      <meta content={formatTitle(null, initials)} property="og:site_name" />
      <meta content="en_US" property="og:locale" />
      <link rel="canonical" href={canonicalUrl} />
      <meta content={canonicalUrl} property="og:url" />

      {env.NEXT_PUBLIC_IMAGE_LOADER && (
        <link rel="preconnect" href={env.NEXT_PUBLIC_IMAGE_LOADER} />
      )}
      {env.NEXT_PUBLIC_MEDIA_PREFIX && (
        <link rel="preconnect" href={env.NEXT_PUBLIC_MEDIA_PREFIX} />
      )}
    </Head>
  );
}
