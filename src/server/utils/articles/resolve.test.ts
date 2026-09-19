import assert from 'node:assert/strict';
import { test } from 'node:test';

import { resolveRefs } from '@/server/utils/articles/resolve';

import type { ArticleRefs } from '@/server/utils/articles/parse';
import type { ResolveSources } from '@/server/utils/articles/resolve';

const SOURCES: ResolveSources = {
  vehicles: {
    'T-72B (1989)': {
      info: { gameId: 'T-72B', slug: 't-72b-1989', role: 'MBT', team: 'Bear' },
    },
  },
  shells: {
    '120mm Rh120 L/55': [
      { name: 'DM53', slug: '120mm-rh120-l55-dm53', displayType: 'APFSDS' },
    ],
    '120mm KBM-2': [
      { name: 'DM53', slug: '120mm-kbm-2-dm53', displayType: 'APFSDS' },
    ],
  },
  articleTitles: new Map([['conquest', 'Conquest and scoring']]),
  glossary: [
    {
      id: 'eraTip',
      label: 'ERA tip',
      definition: 'Reduces ERA.',
      section: 'armour',
      anchor: 'era-tip',
    },
  ],
};

const EMPTY: ArticleRefs = {
  vehicles: [],
  shells: [],
  articles: [],
  terms: [],
  teams: [],
  classes: [],
};

test('resolves a vehicle id to its current display name and slug', () => {
  const { vehicles } = resolveRefs({ ...EMPTY, vehicles: ['T-72B'] }, SOURCES);

  assert.deepEqual(vehicles['T-72B'], {
    name: 'T-72B (1989)',
    slug: 't-72b-1989',
    role: 'MBT',
    team: 'Bear',
  });
});

test('leaves out ids the place does not have', () => {
  const { articles, terms, vehicles } = resolveRefs(
    {
      ...EMPTY,
      vehicles: ['Staging Only'],
      articles: [{ slug: 'missing' }],
      terms: ['nope'],
    },
    SOURCES,
  );

  assert.deepEqual(vehicles, {});
  assert.deepEqual(articles, {});
  assert.deepEqual(terms, {});
});

test('a shell without a weapon takes the first gun that has it', () => {
  const { shells } = resolveRefs(
    { ...EMPTY, shells: [{ name: 'DM53' }] },
    SOURCES,
  );

  assert.equal(shells.DM53.slug, '120mm-rh120-l55-dm53');
});

test('a shell with a weapon resolves on that gun only', () => {
  const { shells } = resolveRefs(
    {
      ...EMPTY,
      shells: [
        { name: 'DM53', weapon: '120mm KBM-2' },
        { name: 'DM53', weapon: 'No such gun' },
      ],
    },
    SOURCES,
  );

  assert.equal(shells['120mm KBM-2::DM53'].slug, '120mm-kbm-2-dm53');
  assert.equal(shells['No such gun::DM53'], undefined);
});
