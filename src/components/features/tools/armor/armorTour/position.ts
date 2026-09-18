import type { Placement } from '@/components/features/tools/armor/armorTour/steps';

export const PADDING = 6;
const TOOLTIP_GAP = 10;
export const TOOLTIP_WIDTH = 280;
export const VIEWPORT_MARGIN = 8;
export const COMPACT_WIDTH = 640;
export const COMPACT_HEIGHT = 560;

const OPPOSITE_PLACEMENT: Record<Placement, Placement> = {
  bottom: 'top',
  left: 'right',
  right: 'left',
  top: 'bottom',
};

export interface TargetRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function clampToViewport(value: number, viewport: number, size: number) {
  return clamp(
    value,
    VIEWPORT_MARGIN,
    Math.max(VIEWPORT_MARGIN, viewport - size - VIEWPORT_MARGIN),
  );
}

export function sameRect(a: TargetRect | null, b: TargetRect | null) {
  if (!a || !b) return a === b;
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height
  );
}

function isScrollContainer(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  return /(auto|scroll|overlay)/.test(`${style.overflowY} ${style.overflowX}`);
}

export function isFullyVisible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  if (
    rect.top < 0 ||
    rect.left < 0 ||
    rect.bottom > window.innerHeight ||
    rect.right > window.innerWidth
  ) {
    return false;
  }

  let parent = element.parentElement;

  while (parent) {
    if (isScrollContainer(parent)) {
      const bounds = parent.getBoundingClientRect();
      if (
        rect.top < bounds.top ||
        rect.bottom > bounds.bottom ||
        rect.left < bounds.left ||
        rect.right > bounds.right
      ) {
        return false;
      }
    }
    parent = parent.parentElement;
  }

  return true;
}

function offsetFor(
  placement: Placement,
  rect: TargetRect,
  width: number,
  height: number,
) {
  const gap = PADDING + TOOLTIP_GAP;

  switch (placement) {
    case 'right':
      return {
        left: rect.left + rect.width + gap,
        top: rect.top + rect.height / 2 - height / 2,
      };
    case 'left':
      return {
        left: rect.left - gap - width,
        top: rect.top + rect.height / 2 - height / 2,
      };
    case 'bottom':
      return {
        left: rect.left + rect.width / 2 - width / 2,
        top: rect.top + rect.height + gap,
      };
    case 'top':
      return {
        left: rect.left + rect.width / 2 - width / 2,
        top: rect.top - gap - height,
      };
  }
}

function fitsViewport(
  placement: Placement,
  offset: { left: number; top: number },
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  switch (placement) {
    case 'right':
      return offset.left + width <= viewportWidth - VIEWPORT_MARGIN;
    case 'left':
      return offset.left >= VIEWPORT_MARGIN;
    case 'bottom':
      return offset.top + height <= viewportHeight - VIEWPORT_MARGIN;
    case 'top':
      return offset.top >= VIEWPORT_MARGIN;
  }
}

export function resolvePosition(
  placement: Placement,
  rect: TargetRect,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  let offset = offsetFor(placement, rect, width, height);

  for (const candidate of [placement, OPPOSITE_PLACEMENT[placement]]) {
    const candidateOffset = offsetFor(candidate, rect, width, height);
    if (
      fitsViewport(
        candidate,
        candidateOffset,
        width,
        height,
        viewportWidth,
        viewportHeight,
      )
    ) {
      offset = candidateOffset;
      break;
    }
  }

  return {
    left: clampToViewport(offset.left, viewportWidth, width),
    top: clampToViewport(offset.top, viewportHeight, height),
  };
}
