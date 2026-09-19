import React from 'react';

import type { ResolvedRefs } from '@/server/api/trpc/routers/articles';

export interface ArticleContextValue {
  refs: ResolvedRefs;
}

const EMPTY_REFS: ResolvedRefs = {
  vehicles: {},
  shells: {},
  articles: {},
  terms: {},
};

const ArticleContext = React.createContext<ArticleContextValue>({
  refs: EMPTY_REFS,
});

export const ArticleProvider = ArticleContext.Provider;

export function useArticle() {
  return React.useContext(ArticleContext);
}
