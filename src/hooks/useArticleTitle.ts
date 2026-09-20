import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { trpc } from '@/utils/trpc';

export function useArticleTitle(slug: string): string | undefined {
  const initials = usePlaceInitials();
  const { data: navigation } = trpc.articles.navigation.useQuery({ initials });

  for (const group of navigation ?? []) {
    for (const link of group.links) {
      if (link.kind === 'article' && link.slug === slug) return link.title;
    }
  }

  return undefined;
}
