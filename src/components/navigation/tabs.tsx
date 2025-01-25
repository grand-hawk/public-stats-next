import { Portal, Tabs } from '@chakra-ui/react';
import React from 'react';

import { tabs } from '@/components/tabs';
import { TabPanelPortalContext } from '@/hooks/tabPanelPortalContext';
import { useNavStore } from '@/stores/nav';

export default function NavigationTabs() {
  const tabPanelRef = React.useContext(TabPanelPortalContext);
  const tab = useNavStore((s) => s.tab);
  const setTab = useNavStore((s) => s.setTab);

  if (tab && !Object.keys(tabs).includes(tab)) setTab(undefined);

  return (
    <Tabs.Root
      fitted
      lazyMount
      size="sm"
      value={tab ?? Object.keys(tabs)[0]}
      variant="subtle"
      onValueChange={(details) => setTab(details.value)}
    >
      <Tabs.List>
        {Object.entries(tabs).map(([value, { label }]) => (
          <Tabs.Trigger key={value} value={value}>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabPanelRef && (
        <Portal container={tabPanelRef}>
          {Object.entries(tabs).map(([value, { Component }]) => (
            <Tabs.Content key={value} value={value}>
              <Component />
            </Tabs.Content>
          ))}
        </Portal>
      )}
    </Tabs.Root>
  );
}
