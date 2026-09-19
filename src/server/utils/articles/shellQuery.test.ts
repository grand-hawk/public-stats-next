import assert from 'node:assert/strict';
import { test } from 'node:test';

import { queryShells } from '@/server/utils/articles/shellQuery';

const SHELLS = {
  '120mm Rh120 L/55': [
    {
      name: 'DM53',
      slug: 'rh120-l55-dm53',
      type: 'APFSDS',
      displayType: 'APFSDS INCENDIARY ANTI-ERA',
      eraTip: 0.4,
      maxPenetration: 700,
    },
    {
      name: 'DM12',
      slug: 'rh120-l55-dm12',
      type: 'HEAT',
      displayType: 'HEAT-FS',
      maxPenetration: 480,
    },
  ],
  '120mm KBM-2': [
    {
      name: 'DM53',
      slug: 'kbm-2-dm53',
      type: 'APFSDS',
      displayType: 'APFSDS INCENDIARY ANTI-ERA',
      eraTip: 0.4,
      maxPenetration: 720,
    },
    {
      name: 'KONUS',
      slug: 'kbm-2-konus',
      type: 'TANDEM F&F MISSILE',
      displayType: 'F&F Top Attack ATGM',
      maxPenetration: 800,
    },
  ],
};

test('an empty query returns nothing', () => {
  assert.deepEqual(queryShells(SHELLS, {}), []);
});

test('filters by display type without caring about case', () => {
  const results = queryShells(SHELLS, {
    displayTypes: ['f&f top attack atgm'],
  });

  assert.deepEqual(
    results.map((shell) => shell.name),
    ['KONUS'],
  );
});

test('finds rounds by part of their underlying type', () => {
  const results = queryShells(SHELLS, { typeIncludes: 'tandem' });

  assert.deepEqual(
    results.map((shell) => shell.name),
    ['KONUS'],
  );
});

test('merges the same round carried by several guns', () => {
  const [shell, ...rest] = queryShells(SHELLS, { eraTip: 0.4 });

  assert.equal(rest.length, 0);
  assert.equal(shell.slug, 'rh120-l55-dm53');
  assert.deepEqual(shell.weapons, ['120mm Rh120 L/55', '120mm KBM-2']);
  assert.equal(shell.maxPenetration, 720);
});

test('rounds without an anti-ERA value never match an eraTip filter', () => {
  assert.deepEqual(queryShells(SHELLS, { eraTip: 1 }), []);
});
