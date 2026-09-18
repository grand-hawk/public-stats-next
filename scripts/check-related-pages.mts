import assert from 'node:assert';

import { computeRelatedPages } from '@/server/utils/relatedPages';
import { getLoadouts } from '@generated/loadouts';

import type { PlaceId } from '@generated/config';

const placeId = Object.keys(getLoadouts().data)[0] as PlaceId;
const items = computeRelatedPages(placeId, 'mtc', '/teams/eagle-federation');

for (const item of items) {
  console.log(
    `[${item.reason.padEnd(8)}] ${item.page.type.padEnd(7)} ${item.title}`,
  );
}

assert.ok(items.length > 0, 'expected related pages');
assert.ok(
  !items.some((item) => item.href.endsWith('/teams/eagle-federation')),
  'self must be excluded',
);
assert.strictEqual(
  new Set(items.map((item) => item.href)).size,
  items.length,
  'no duplicates',
);

const ranks = items.map(
  (item) => ({ linked: 0, backlink: 1, similar: 2 })[item.reason],
);
assert.deepStrictEqual(
  [...ranks].sort((a, b) => a - b),
  ranks,
  'tiers must not interleave',
);

console.log('\nOK: all assertions passed');
