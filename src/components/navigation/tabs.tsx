import { Tabs } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { tabs } from '@/components/navigation/tabData';

export default function NavigationTabs() {
  const router = useRouter();

  const currentTab = Object.entries(tabs).find(
    ([, tab]) => tab.path === router.asPath,
  );

  React.useEffect(() => {
    for (const tab of Object.values(tabs)) router.prefetch(tab.path);
  }, [router]);

  return (
    <Tabs.Root
      fitted
      lazyMount
      size="sm"
      value={currentTab ? currentTab[0] : undefined}
      variant="subtle"
      onValueChange={(details) => {
        const targetTab = tabs[details.value];
        if (!targetTab) return;

        router.push(targetTab.path);
      }}
    >
      <Tabs.List>
        {Object.entries(tabs).map(([value, { label }]) => (
          <Tabs.Trigger key={value} value={value}>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
