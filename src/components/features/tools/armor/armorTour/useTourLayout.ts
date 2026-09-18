import React from 'react';

import {
  COMPACT_HEIGHT,
  COMPACT_WIDTH,
  TOOLTIP_WIDTH,
  VIEWPORT_MARGIN,
  clampToViewport,
  isFullyVisible,
  resolvePosition,
  sameRect,
} from '@/components/features/tools/armor/armorTour/position';
import { STEPS } from '@/components/features/tools/armor/armorTour/steps';

import type { TargetRect } from '@/components/features/tools/armor/armorTour/position';

export interface TourLayout {
  compact: boolean;
  left: number;
  rect: TargetRect | null;
  top: number;
  width: number;
}

export function useTourLayout(
  open: boolean,
  step: number,
  tooltipRef: React.RefObject<HTMLDivElement | null>,
) {
  const [layout, setLayout] = React.useState<TourLayout | null>(null);

  React.useLayoutEffect(() => {
    if (!open) return;

    const element = document.querySelector(
      `[data-tour="${STEPS[step].target}"]`,
    ) as HTMLElement | null;

    if (element) {
      element.style.position = 'relative';
      element.style.zIndex = '10001';
      if (!isFullyVisible(element)) {
        element.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest',
        });
      }
    }

    const update = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const compact =
        viewportWidth < COMPACT_WIDTH || viewportHeight < COMPACT_HEIGHT;
      const bounds = element?.getBoundingClientRect() ?? null;
      const rect = bounds
        ? {
            height: bounds.height,
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
          }
        : null;
      const width = Math.min(
        TOOLTIP_WIDTH,
        viewportWidth - VIEWPORT_MARGIN * 2,
      );

      let left = VIEWPORT_MARGIN;
      let top = VIEWPORT_MARGIN;

      if (!compact) {
        const height = tooltipRef.current?.offsetHeight ?? 0;

        if (rect) {
          const position = resolvePosition(
            STEPS[step].placement,
            rect,
            width,
            height,
            viewportWidth,
            viewportHeight,
          );
          left = position.left;
          top = position.top;
        } else {
          left = clampToViewport(
            (viewportWidth - width) / 2,
            viewportWidth,
            width,
          );
          top = clampToViewport(
            (viewportHeight - height) / 2,
            viewportHeight,
            height,
          );
        }
      }

      setLayout((previous) =>
        previous &&
        previous.compact === compact &&
        previous.left === left &&
        previous.top === top &&
        previous.width === width &&
        sameRect(previous.rect, rect)
          ? previous
          : { compact, left, rect, top, width },
      );
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    if (element) observer.observe(element);
    if (tooltipRef.current) observer.observe(tooltipRef.current);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      if (element) {
        element.style.position = '';
        element.style.zIndex = '';
      }
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, step, tooltipRef]);

  return layout;
}
