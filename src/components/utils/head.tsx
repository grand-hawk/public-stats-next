import Head from 'next/head';
import React from 'react';

import { MEDIA_PREFIX } from '@/env';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';

import type { Place } from '@/utils/placeUtils';
import type { PropsWithChildren } from 'react';

export const getKeywords = (place: Place) => [
  place.placeName,
  place.initials.toUpperCase(),
  'Statistics',
  'Stats',
  'Data',
];

export default function InternalHead({ children }: PropsWithChildren) {
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();

  return (
    <Head>
      <title>{formatTitle(currentTab?.label, initials)}</title>
      <link
        href={`${MEDIA_PREFIX}/favicon.ico`}
        rel="icon"
        type="image/x-icon"
      />

      <meta content="website" property="og:type" />
      <meta content="index,follow" name="robots" />
      <meta content={formatTitle(null, initials)} property="og:site_name" />

      {children}
    </Head>
  );
}
