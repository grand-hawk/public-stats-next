import React from 'react';

import {
  DURATION_BASE,
  DURATION_MEDIUM,
  EASE_IN,
  EASE_OUT,
} from '@/components/layout/shell/constants';

import type { SystemStyleObject } from '@chakra-ui/react';

export type WipeDirection = 'down' | 'up' | 'right';

export interface WipeState {
  duration: string;
  open: boolean;
  timing: string;
}

const VISIBLE_CLIP_PATH = 'inset(-48px -48px -48px -48px)';

const HIDDEN_CLIP_PATH: Record<WipeDirection, string> = {
  down: 'inset(-48px -48px 100% -48px)',
  up: 'inset(100% -48px -48px -48px)',
  right: 'inset(-48px 100% -48px -48px)',
};

const HIDDEN_TRANSFORM: Record<WipeDirection, string> = {
  down: 'translateY(-8px)',
  up: 'translateY(8px)',
  right: 'translateX(-8px)',
};

export function useWipe(open: boolean): WipeState {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return {
    duration: !mounted ? '0ms' : open ? DURATION_MEDIUM : DURATION_BASE,
    open,
    timing: open ? EASE_OUT : EASE_IN,
  };
}

export function wipeDirectionCss(
  { open }: WipeState,
  direction: WipeDirection,
): SystemStyleObject {
  return {
    transform: open ? 'none' : HIDDEN_TRANSFORM[direction],
    clipPath: open ? VISIBLE_CLIP_PATH : HIDDEN_CLIP_PATH[direction],
  };
}

export function wipeBackdropCss(wipe: WipeState): SystemStyleObject {
  return {
    position: 'fixed',
    inset: 0,
    zIndex: 300,
    background: 'var(--background-color-backdrop-light)',
    opacity: wipe.open ? 1 : 0,
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    transitionDuration: wipe.duration,
    transitionTimingFunction: wipe.timing,
    visibility: wipe.open ? 'visible' : 'hidden',
  };
}

export function wipeCardCss(
  wipe: WipeState,
  direction: WipeDirection,
): SystemStyleObject {
  return {
    position: 'fixed',
    contain: 'content',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border-color-base)',
    borderRadius: '8px',
    contentVisibility: wipe.open ? 'visible' : 'hidden',
    ...wipeDirectionCss(wipe, direction),
    transitionProperty: 'clip-path, transform, content-visibility',
    transitionBehavior: 'allow-discrete',
    transitionDuration: wipe.duration,
    transitionTimingFunction: wipe.timing,
  };
}

export function wipeContentCss(wipe: WipeState): SystemStyleObject {
  return {
    overflow: 'auto',
    overscrollBehavior: 'contain',
    opacity: wipe.open ? 1 : 0,
    transitionProperty: 'opacity',
    transitionDuration: wipe.duration,
    transitionTimingFunction: wipe.timing,
  };
}
