import NextHead from 'next/head';
import React from 'react';

import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { formatTitle } from '@/utils/formatTitle';

import type { PropsWithChildren } from 'react';

export default function Head({ children }: PropsWithChildren) {
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();

  return (
    <NextHead>
      <title>{formatTitle(currentTab?.label, initials)}</title>
      {children}
    </NextHead>
  );
}
