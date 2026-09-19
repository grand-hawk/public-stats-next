import { useRouter } from 'next/router';
import { LuFileText } from 'react-icons/lu';

import { menuGroups, tabs } from '@/components/layout/navigation/tabs';
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

  const tabLink = (key: TabKey): MenuLink => {
    const tab = tabs[key];

    return {
      label: tab.longLabel ?? tab.label,
      href: `/${initials}${tab.path}`,
      icon: tab.icon,
      active: currentTab?.path === tab.path,
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
      link.kind === 'tab' && link.tabKey in tabs
        ? [tabLink(link.tabKey as TabKey)]
        : [],
    );
    const browse = pages[0];

    if (browse && BROWSE_GROUPS.has(group.key)) browse.links.push(...links);
    else pages.push({ label: group.label, links });
  }

  const articles = navigation.map((group) => ({
    label: group.label,
    links: group.links.flatMap((link): MenuLink[] => {
      if (link.kind !== 'article' || !link.nav) return [];

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
