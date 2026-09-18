import { menuGroups, tabs } from '@/components/layout/navigation/tabs';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { Tab } from '@/components/layout/navigation/tabs';

export interface MenuLink {
  label: string;
  href: string;
  icon: Tab['icon'];
  active: boolean;
  external: boolean;
  prefetch?: true;
}

export interface ResolvedMenuGroup {
  label: string;
  links: MenuLink[];
}

export function useMenuLinks(): ResolvedMenuGroup[] {
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();

  return menuGroups.map((group) => ({
    label: group.label,
    links: group.entries.map((entry): MenuLink => {
      if (entry.type === 'external') {
        return {
          label: entry.link.label,
          href: entry.link.href,
          icon: entry.link.icon,
          active: false,
          external: true,
        };
      }
      const tab = tabs[entry.key];
      const href = `/${initials}${tab.path}`;
      return {
        label: tab.longLabel ?? tab.label,
        href,
        icon: tab.icon,
        active: currentTab?.path === tab.path,
        external: false,
        prefetch: tab.prefetch,
      };
    }),
  }));
}
