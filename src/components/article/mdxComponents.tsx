import ApsTable from '@/components/article/apsTable';
import Callout from '@/components/article/callout';
import {
  ArticleAnchor,
  ArticleH2,
  ArticleH3,
  ArticleImage,
  ArticleTable,
} from '@/components/article/elements';
import EraPanelTable from '@/components/article/eraPanelTable';
import Figure from '@/components/article/figure';
import Formula from '@/components/article/formula';
import GlossaryList from '@/components/article/glossaryList';
import ImageNeeded from '@/components/article/imageNeeded';
import {
  ClassLink,
  ShellLink,
  TeamLink,
  VehicleLink,
  WikiLink,
} from '@/components/article/links';
import MainArticle from '@/components/article/mainArticle';
import { ShellList, ShellTable } from '@/components/article/shellQuery';
import Term from '@/components/article/term';

import type { MDXComponents } from 'mdx/types';

export const articleMdxComponents: MDXComponents = {
  a: ArticleAnchor,
  h2: ArticleH2,
  h3: ArticleH3,
  img: ArticleImage,
  table: ArticleTable,
  ApsTable,
  Callout,
  ClassLink,
  EraPanelTable,
  Figure,
  Formula,
  GlossaryList,
  ImageNeeded,
  MainArticle,
  ShellLink,
  ShellList,
  ShellTable,
  TeamLink,
  Term,
  VehicleLink,
  WikiLink,
};
