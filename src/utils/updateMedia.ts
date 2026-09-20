import type { UpdateMedia } from '@/server/utils/updates/types';

export const isVideo = (media: UpdateMedia) =>
  media.mimeType.startsWith('video/');

export interface VideoAttributes {
  autoPlay: boolean;
  controls: boolean;
  loop: boolean;
  muted: boolean;
  preload: 'auto' | 'metadata';
}

export const videoAttributes = (loop: boolean): VideoAttributes => ({
  autoPlay: loop,
  controls: !loop,
  loop,
  muted: loop,
  preload: loop ? 'auto' : 'metadata',
});
