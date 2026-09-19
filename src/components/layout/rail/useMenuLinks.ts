import { useRouter } from 'next/router';
import { LuFileText } from 'react-icons/lu';

import {
  menuGroups,
  primaryTabKeys,
  tabs,
} from '@/components/layout/navigation/tabs';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { trpc } from '@/utils/trpc';

import type { Tab, TabKey } from '@/components/layout/navigation/tabs';

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

const BROWSE_GROUPS = new Set(['vehicles', 'weapons']);
const SECOND_COLUMN_TABS = new Set(['vehicleFamilies']);

export interface MenuColumns {
  pages: ResolvedMenuGroup[];
  articles: ResolvedMenuGroup[];
}

export function useMenuLinks(): MenuColumns {
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();
  const router = useRouter();
  const { data: navigation } = trpc.articles.navigation.useQuery();

  const currentPath = router.asPath.split(/[?#]/)[0];

  const activePath = Object.values(tabs).reduce<string | undefined>(
    (longest, tab) => {
      const prefix = `/${initials}${tab.path}`;
      const rest = currentPath.slice(prefix.length);

      if (!currentPath.startsWith(prefix) || (rest && !rest.startsWith('/'))) {
        return longest;
      }

      return !longest || tab.path.length > longest.length ? tab.path : longest;
    },
    undefined,
  );

  const tabLink = (key: TabKey): MenuLink => {
    const tab = tabs[key];

    return {
      label: tab.longLabel ?? tab.label,
      href: `/${initials}${tab.path}`,
      icon: tab.icon,
      active: (activePath ?? currentTab?.path) === tab.path,
      external: false,
      prefetch: tab.prefetch,
    };
  };

  if (!navigation) {
    return {
      pages: menuGroups.map((group) => ({
        label: group.label,
        links: group.entries.map((entry): MenuLink => {
          if (entry.type === 'tab') return tabLink(entry.key);

          return {
            label: entry.link.label,
            href: entry.link.href,
            icon: entry.link.icon,
            active: false,
            external: true,
          };
        }),
      })),
      articles: [],
    };
  }

  const pages: ResolvedMenuGroup[] = [];
  for (const group of navigation) {
    const links = group.links.flatMap((link): MenuLink[] =>
      link.kind === 'tab' &&
      link.tabKey in tabs &&
      !SECOND_COLUMN_TABS.has(link.tabKey)
        ? [tabLink(link.tabKey as TabKey)]
        : [],
    );
    const browse = pages[0];

    if (browse && BROWSE_GROUPS.has(group.key)) browse.links.push(...links);
    else pages.push({ label: group.label, links });
  }

  const railOrder = primaryTabKeys.map(
    (key) => `/${initials}${tabs[key].path}`,
  );
  const rank = (link: MenuLink) => {
    const index = railOrder.indexOf(link.href);
    return index === -1 ? railOrder.length : index;
  };
  pages[0]?.links.sort((a, b) => rank(a) - rank(b));

  const articles = navigation.map((group) => ({
    label: group.label,
    links: group.links.flatMap((link): MenuLink[] => {
      if (link.kind === 'tab') {
        return SECOND_COLUMN_TABS.has(link.tabKey) && link.tabKey in tabs
          ? [tabLink(link.tabKey as TabKey)]
          : [];
      }

      if (!link.nav) return [];

      const href = `/${initials}/${link.slug}`;
      return [
        {
          label: link.title,
          href,
          icon: LuFileText,
          active: currentPath === href,
          external: false,
        },
      ];
    }),
  }));

  return {
    pages: pages.filter((group) => group.links.length > 0),
    articles: articles.filter((group) => group.links.length > 0),
  };
}
