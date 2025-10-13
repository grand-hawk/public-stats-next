import { useRouter } from 'next/router';
import React from 'react';

import { tabs } from '@/components/navigation/tabs';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

export function useCurrentTab() {
  const router = useRouter();
  const initials = usePlaceInitials();

  const currentTab = React.useMemo(() => {
    for (const tab of Object.values(tabs)) {
      if (router.asPath.startsWith(`/${initials}${tab.path}`)) return tab;
    }
  }, [router.asPath, initials]);

  return currentTab;
}
