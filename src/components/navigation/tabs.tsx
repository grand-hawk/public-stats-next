import { Tabs } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { tabs } from '@/components/navigation/tabData';

export default function NavigationTabs() {
  const router = useRouter();

  const currentTab = Object.entries(tabs).find(([, tab]) =>
    router.asPath.startsWith(tab.path),
  );

  React.useEffect(() => {
    for (const [tabName, tab] of Object.entries(tabs))
      if (currentTab?.[0] !== tabName) router.prefetch(tab.path);
  }, [currentTab, router]);

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
      <Tabs.List justifyContent="end">
        {Object.entries(tabs).map(([value, tab]) => (
          <Tabs.Trigger
            key={value}
            maxWidth="150px"
            value={value}
            onClick={() => {
              if (!currentTab) return;
              if (currentTab[0] !== value) return;
              if (router.asPath === tab.path) return;

              router.push(tab.path);
            }}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
