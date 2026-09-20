import dynamic from 'next/dynamic';

import type { MDXContent } from 'mdx/types';
import type { ComponentType } from 'react';

type ArticleModule = ComponentType<React.ComponentProps<MDXContent>>;

export const articleModules: Record<string, ArticleModule> = {
  'active-protection-system': dynamic(
    () => import('../../content/articles/active-protection-system/index.mdx'),
  ),
  'anti-era-round': dynamic(
    () => import('../../content/articles/anti-era-round/index.mdx'),
  ),
  'armour-and-penetration': dynamic(
    () => import('../../content/articles/armour-and-penetration/index.mdx'),
  ),
  'capture-point': dynamic(
    () => import('../../content/articles/capture-point/index.mdx'),
  ),
  conquest: dynamic(() => import('../../content/articles/conquest/index.mdx')),
  damage: dynamic(() => import('../../content/articles/damage/index.mdx')),
  'explosive-reactive-armour': dynamic(
    () => import('../../content/articles/explosive-reactive-armour/index.mdx'),
  ),
  glossary: dynamic(() => import('../../content/articles/glossary/index.mdx')),
  'line-of-sight-thickness': dynamic(
    () => import('../../content/articles/line-of-sight-thickness/index.mdx'),
  ),
  'match-result': dynamic(
    () => import('../../content/articles/match-result/index.mdx'),
  ),
  penetration: dynamic(
    () => import('../../content/articles/penetration/index.mdx'),
  ),
  'player-score': dynamic(
    () => import('../../content/articles/player-score/index.mdx'),
  ),
  ricochet: dynamic(() => import('../../content/articles/ricochet/index.mdx')),
  'slat-armour': dynamic(
    () => import('../../content/articles/slat-armour/index.mdx'),
  ),
  'tandem-warhead': dynamic(
    () => import('../../content/articles/tandem-warhead/index.mdx'),
  ),
  'team-score': dynamic(
    () => import('../../content/articles/team-score/index.mdx'),
  ),
  'ticket-conquest': dynamic(
    () => import('../../content/articles/ticket-conquest/index.mdx'),
  ),
  tier: dynamic(() => import('../../content/articles/tier/index.mdx')),
};
