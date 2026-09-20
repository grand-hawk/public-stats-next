import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  normaliseList,
  normaliseMedia,
  normaliseUpdate,
} from '@/server/utils/updates/normalise';
import {
  isPreviewAuthorised,
  previewToken,
} from '@/server/utils/updates/previewToken';
import { vehicleTargetsIn } from '@/server/utils/updates/vehicleLinks';
import { isVideo, videoAttributes } from '@/utils/updateMedia';
import { normaliseTarget } from '@/utils/vehicleLink';

const IMAGE = {
  url: 'https://files.example/shot.png',
  mimeType: 'image/png',
  alt: 'A tank',
  width: 1280,
  height: 720,
};

const DOC = {
  slug: 'ticket-conquest',
  title: 'Ticket Conquest',
  date: '2026-09-20T00:00:00.000Z',
  summary: 'A new game mode.',
  _status: 'published',
  content: [
    { blockType: 'prose', text: '## Heading\n\nSome words.' },
    {
      blockType: 'media',
      file: { url: 'https://files.example/clip.mp4', mimeType: 'video/mp4' },
      caption: 'The ticket bar',
      loop: true,
    },
    { blockType: 'quest', questId: 'nope' },
    { blockType: 'media', file: null },
    { blockType: 'prose', text: '   ' },
  ],
};

test('normaliseMedia keeps the fields the page needs', () => {
  const media = normaliseMedia({ ...IMAGE, poster: { url: 'poster.png' } });

  assert.equal(media?.url, IMAGE.url);
  assert.equal(media?.alt, 'A tank');
  assert.equal(media?.width, 1280);
  assert.equal(media?.poster, 'poster.png');
});

test('a relative media url is resolved against the CMS', () => {
  const media = normaliseMedia(
    { url: '/api/media/file/shot.png', mimeType: 'image/png' },
    'https://cms.example',
  );

  assert.equal(media?.url, 'https://cms.example/api/media/file/shot.png');

  const absolute = normaliseMedia(IMAGE, 'https://cms.example');
  assert.equal(absolute?.url, IMAGE.url);
});

test('normaliseMedia rejects anything without a url', () => {
  assert.equal(normaliseMedia(null), undefined);
  assert.equal(normaliseMedia({ mimeType: 'image/png' }), undefined);
  assert.equal(normaliseMedia('https://files.example/x.png'), undefined);
});

test('normaliseUpdate keeps known blocks and drops the rest', () => {
  const update = normaliseUpdate(DOC);

  assert.equal(update?.blocks.length, 2);
  assert.deepEqual(update?.blocks[0], {
    kind: 'prose',
    text: '## Heading\n\nSome words.',
  });
  assert.equal(update?.blocks[1].kind, 'media');
  assert.equal(update?.draft, false);
});

test('normaliseUpdate treats anything unpublished as a draft', () => {
  assert.equal(normaliseUpdate({ ...DOC, _status: 'draft' })?.draft, true);
  assert.equal(normaliseUpdate({ ...DOC, _status: undefined })?.draft, true);
});

test('normaliseUpdate needs a slug, title and date', () => {
  assert.equal(normaliseUpdate({ ...DOC, slug: '' }), null);
  assert.equal(normaliseUpdate({ ...DOC, title: undefined }), null);
  assert.equal(normaliseUpdate({ ...DOC, date: null }), null);
  assert.equal(normaliseUpdate(null), null);
});

test('normaliseList survives a failed or empty response', () => {
  assert.deepEqual(normaliseList(null), []);
  assert.deepEqual(normaliseList({ docs: 'nope' }), []);
  assert.deepEqual(
    normaliseList({ docs: [DOC, { slug: 'broken' }] }).length,
    1,
  );
});

test('the preview token is derived from the slug and matches the CMS', () => {
  assert.equal(previewToken('hotfix', 's3cret'), '4cfbaa9386bcc967');
  assert.equal(previewToken('ticket-conquest', 's3cret'), 'e91938da54c3a4cc');
  assert.notEqual(
    previewToken('hotfix', 's3cret'),
    previewToken('other', 's3cret'),
  );
});

test('a draft is only revealed for its own token', () => {
  const token = previewToken('hotfix', 's3cret');

  assert.equal(isPreviewAuthorised(token, 'hotfix', 's3cret'), true);
  assert.equal(isPreviewAuthorised(token, 'other', 's3cret'), false);
  assert.equal(isPreviewAuthorised(token, 'hotfix', 'wrong-secret'), false);
  assert.equal(isPreviewAuthorised('s3cret', 'hotfix', 's3cret'), false);
  assert.equal(isPreviewAuthorised(undefined, 'hotfix', 's3cret'), false);
  assert.equal(isPreviewAuthorised(token, 'hotfix', undefined), false);
});

test('a looping clip plays itself with no controls', () => {
  assert.deepEqual(videoAttributes(true), {
    autoPlay: true,
    controls: false,
    loop: true,
    muted: true,
    preload: 'auto',
  });

  assert.deepEqual(videoAttributes(false), {
    autoPlay: false,
    controls: true,
    loop: false,
    muted: false,
    preload: 'metadata',
  });
});

test('media kind comes from the file itself', () => {
  assert.equal(isVideo({ ...IMAGE, mimeType: 'video/mp4' }), true);
  assert.equal(isVideo(IMAGE), false);
});

test('a gallery keeps its items in order, dropping any without a file', () => {
  const update = normaliseUpdate({
    ...DOC,
    content: [
      {
        blockType: 'gallery',
        items: [
          { file: IMAGE, caption: 'First' },
          { file: null, caption: 'Broken' },
          { file: { ...IMAGE, url: 'https://files.example/two.png' } },
        ],
      },
    ],
  });

  const block = update?.blocks[0];

  assert.equal(block?.kind, 'gallery');
  assert.equal(block?.kind === 'gallery' && block.items.length, 2);
  assert.equal(block?.kind === 'gallery' && block.items[0].caption, 'First');
  assert.equal(block?.kind === 'gallery' && block.items[1].caption, undefined);
});

test('a gallery with nothing usable is dropped', () => {
  const update = normaliseUpdate({
    ...DOC,
    content: [{ blockType: 'gallery', items: [{ file: null }] }],
  });

  assert.deepEqual(update?.blocks, []);
});

test('vehicle targets are pulled out of prose links', () => {
  assert.deepEqual(
    vehicleTargetsIn(
      'The [Namer APC](vehicle:Namer APC) and the [T-72B3](vehicle:t-72b3), plus [an article](/rv/conquest) and [Namer again](vehicle:Namer APC).',
    ),
    ['Namer APC', 't-72b3'],
  );
});

test('targets match regardless of case and spacing', () => {
  assert.equal(normaliseTarget('  Namer APC '), 'namer apc');
});

test('bracketed targets are found too, for names with spaces', () => {
  assert.deepEqual(
    vehicleTargetsIn('The [Wiesel 1A4](<vehicle:Wiesel 1A4>) got armour.'),
    ['Wiesel 1A4'],
  );
});

test('a bracketed target keeps brackets that are part of the name', () => {
  assert.deepEqual(
    vehicleTargetsIn(
      'The [Achzarit Mk.2 (RCWS-30)](<vehicle:Achzarit Mk.2 (RCWS-30)>) and the [Maus](vehicle:Maus).',
    ),
    ['Achzarit Mk.2 (RCWS-30)', 'Maus'],
  );
});

test('a percent encoded target matches the plain one', () => {
  assert.equal(normaliseTarget('Wiesel%201A4'), 'wiesel 1a4');
  assert.equal(normaliseTarget('Wiesel 1A4'), 'wiesel 1a4');
  assert.equal(normaliseTarget('100%'), '100%');
});
