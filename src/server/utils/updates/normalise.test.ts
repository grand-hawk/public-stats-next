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
import { isVideo, videoAttributes } from '@/utils/updateMedia';

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
