import React from 'react';

import {
  primaryTabKeys,
  secondaryTabKeys,
  tabs,
  toolsTabKeys,
} from '@/components/layout/navigation/tabs';
import SidebarGroup from '@/components/layout/sidebar/sidebarGroup';
import SidebarItem from '@/components/layout/sidebar/sidebarItem';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

const sidebarGroups = [
  { keys: primaryTabKeys, label: undefined },
  { keys: secondaryTabKeys, label: 'Analytics' },
  { keys: toolsTabKeys, label: 'Tools' },
];

interface SidebarNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export default function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();

  return sidebarGroups.map(({ keys, label }) => (
    <SidebarGroup key={label ?? 'primary'} collapsed={collapsed} label={label}>
      {keys.map((key) => {
        const tab = tabs[key];
        return (
          <SidebarItem
            key={key}
            active={currentTab?.path === tab.path}
            collapsed={collapsed}
            color={tab.color}
            href={`/${initials}${tab.path}`}
            icon={tab.icon}
            label={tab.label}
            onClick={onNavigate}
          />
        );
      })}
    </SidebarGroup>
  ));
}
