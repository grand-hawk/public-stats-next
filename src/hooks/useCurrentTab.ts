import { usePathname } from 'next/navigation';
import React from 'react';

import { tabs } from '@/components/layout/navigation/tabs';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

export function useCurrentTab() {
  const pathname = usePathname();
  const initials = usePlaceInitials();

  const currentTab = React.useMemo(() => {
    if (!initials) return;

    for (const tab of Object.values(tabs)) {
      if (pathname.startsWith(`/${initials}${tab.path}`)) return tab;
    }
  }, [pathname, initials]);

  return currentTab;
}
