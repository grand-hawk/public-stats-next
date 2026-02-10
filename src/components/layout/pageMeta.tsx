import Head from 'next/head';
import React from 'react';
import { createContext, useContext } from 'react';

import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';

import type { ReactNode } from 'react';

export interface PageMetaValues {
  title?: string;
  description?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

const PageMetaContext = createContext<PageMetaValues>({});

export default function PageMeta({
  children,
  description,
  ogDescription,
  title,
  twitterCard,
}: PageMetaValues & { children: ReactNode }) {
  const parent = useContext(PageMetaContext);

  const value: PageMetaValues = {
    title: title ?? parent.title,
    description: description ?? parent.description,
    ogDescription: ogDescription ?? parent.ogDescription,
    twitterCard: twitterCard ?? parent.twitterCard,
  };

  return (
    <PageMetaContext.Provider value={value}>
      {children}
    </PageMetaContext.Provider>
  );
}

export function PageMetaHead() {
  const pageMeta = useContext(PageMetaContext);
  const currentTab = useCurrentTab();
  const initials = usePlaceInitials();

  const title = pageMeta.title ?? currentTab?.label;
  const description = pageMeta.description ?? currentTab?.description;
  const ogDescription = pageMeta.ogDescription ?? description;
  const twitterCard = pageMeta.twitterCard ?? 'summary';

  return (
    <Head>
      {pageMeta.title && <title>{formatTitle(pageMeta.title, initials)}</title>}

      {title && <meta content={title} property="og:title" />}
      {title && <meta content={title} name="twitter:title" />}
      <meta content={twitterCard} name="twitter:card" />
      {description && <meta content={description} name="description" />}
      {ogDescription && (
        <>
          <meta content={ogDescription} property="og:description" />
          <meta content={ogDescription} name="twitter:description" />
        </>
      )}
    </Head>
  );
}
