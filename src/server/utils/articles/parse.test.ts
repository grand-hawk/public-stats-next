import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseArticle } from '@/server/utils/articles/parse';

const SOURCE = `---
title: Armour and penetration
summary: How armour is read.
group: weapons
updated: 2026-09-19
aliases:
  - armour
---

import plate from './plate.png';

Intro with <Term id="eraTip" /> and <VehicleLink id="T-72B" />.

## How armour is read

<Figure src={plate} alt="A plate" caption="Plate caption" />

<Figure src={plate} />

### Slat armour

| Panel | KE |
|---|---|
| Relikt | 72 |

<VehicleLink id="T-90M" /> and <VehicleLink id="T-14" />.

<ShellLink name="DM53" weapon="120mm Rh120 L/55" /> and <ShellLink name="M829A3" />.

See <WikiLink to="conquest#scoring">scoring</WikiLink>.

<MainArticle to="glossary" />
`;

test('reads frontmatter with defaults', () => {
  const { meta, metaErrors } = parseArticle('armour-and-penetration', SOURCE);

  assert.deepEqual(metaErrors, []);
  assert.equal(meta.title, 'Armour and penetration');
  assert.equal(meta.group, 'weapons');
  assert.equal(meta.updated, '2026-09-19');
  assert.deepEqual(meta.aliases, ['armour']);
  assert.equal(meta.order, 100);
  assert.equal(meta.nav, false);
  assert.equal(meta.draft, false);
});

test('reports missing and unknown frontmatter keys', () => {
  const { metaErrors } = parseArticle('x', '---\ntitle: X\nbogus: 1\n---\n\nHi');

  assert.ok(metaErrors.some((error) => error.includes('"bogus"')));
  assert.ok(metaErrors.some((error) => error.includes('"summary"')));
  assert.ok(metaErrors.some((error) => error.includes('"updated"')));
});

test('builds the outline with slug ids', () => {
  const { outline } = parseArticle('a', SOURCE);

  assert.deepEqual(outline, [
    { depth: 2, text: 'How armour is read', id: 'how-armour-is-read' },
    { depth: 3, text: 'Slat armour', id: 'slat-armour' },
  ]);
});

test('extracts entity references once each', () => {
  const { refs } = parseArticle('a', SOURCE);

  assert.deepEqual(refs.vehicles, ['T-72B', 'T-90M', 'T-14']);
  assert.deepEqual(refs.shells, [
    { name: 'DM53', weapon: '120mm Rh120 L/55' },
    { name: 'M829A3', weapon: undefined },
  ]);
  assert.deepEqual(refs.articles, [
    { slug: 'conquest', anchor: 'scoring' },
    { slug: 'glossary', anchor: undefined },
  ]);
  assert.deepEqual(refs.terms, ['eraTip']);
});

test('plain text keeps prose, tables and captions but no code', () => {
  const { text } = parseArticle('a', SOURCE);

  assert.ok(text.includes('Intro with'));
  assert.ok(text.includes('Relikt'));
  assert.ok(text.includes('Plate caption'));
  assert.ok(!text.includes('import'));
  assert.ok(!text.includes('title:'));
});

test('flags figures without alt text and bare images', () => {
  const { bareImages, figures } = parseArticle(
    'a',
    `${SOURCE}\n![bare](./x.png)\n`,
  );

  assert.deepEqual(
    figures.map((figure) => figure.hasAlt),
    [true, false],
  );
  assert.equal(bareImages.length, 1);
});

test('knows whether the opening paragraph has a bold term', () => {
  assert.equal(parseArticle('a', SOURCE).leadHasBold, false);
  assert.equal(
    parseArticle('a', SOURCE.replace('Intro with', '**Intro** with'))
      .leadHasBold,
    true,
  );
});

test('accepts windows line endings', () => {
  const { meta, outline } = parseArticle('a', SOURCE.replace(/\n/g, '\r\n'));

  assert.equal(meta.title, 'Armour and penetration');
  assert.equal(outline.length, 2);
});
