import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseGlossary } from '@/server/utils/articles/glossary';
import {
  buildNavigation,
  parseNavigation,
} from '@/server/utils/articles/navigation';
import { parseArticle } from '@/server/utils/articles/parse';

const NAVIGATION = `
groups:
  - key: weapons
    label: Weapons and ammunition
    tabs:
      - shells
  - key: gameplay
    label: Gameplay
`;

function article(slug: string, group: string) {
  return parseArticle(
    slug,
    `---\ntitle: ${slug}\nsummary: About ${slug}.\ngroup: ${group}\nupdated: 2026-09-19\n---\n\nBody`,
  );
}

test('groups list their tabs first and then their articles', () => {
  const groups = buildNavigation(parseNavigation(NAVIGATION), [
    article('armour-and-penetration', 'weapons'),
    article('conquest', 'gameplay'),
  ]);

  assert.deepEqual(
    groups.map((group) => group.links.map((link) => link.kind)),
    [['tab', 'article'], ['article']],
  );
  assert.equal(groups[1].links[0].kind === 'article' && groups[1].links[0].slug, 'conquest');
});

test('a group without a tabs key has no tab links', () => {
  const [, gameplay] = parseNavigation(NAVIGATION);

  assert.deepEqual(gameplay.tabs, []);
});

test('glossary anchors come from the label', () => {
  const [term] = parseGlossary(
    'terms:\n  - id: eraTip\n    label: ERA tip\n    section: armour\n    definition: Reduces ERA.\n',
  );

  assert.equal(term.anchor, 'era-tip');
  assert.equal(term.definition, 'Reduces ERA.');
});
