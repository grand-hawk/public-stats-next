import React from 'react';

const TOUCH_DRAG_THRESHOLD = 8;

interface Pan {
  x: number;
  y: number;
}

interface UseTouchGesturesOptions {
  disabled?: boolean;
  hideTooltip: () => void;
  pan: Pan;
  setPan: (pan: Pan) => void;
  showTooltipAt: (clientX: number, clientY: number) => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  zoomBy: (factor: number, anchorX: number, anchorY: number) => void;
}

export function useTouchGestures({
  disabled,
  hideTooltip,
  pan,
  setPan,
  showTooltipAt,
  viewportRef,
  zoomBy,
}: UseTouchGesturesOptions) {
  const lastTouchDist = React.useRef<number | null>(null);
  const panStart = React.useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const dragging = React.useRef(false);

  const handleTouchStart = React.useCallback(
    (event: TouchEvent) => {
      if (disabled) return;

      event.preventDefault();

      if (event.touches.length === 1) {
        const t = event.touches[0];
        panStart.current = {
          x: t.clientX,
          y: t.clientY,
          panX: pan.x,
          panY: pan.y,
        };
        dragging.current = false;
        lastTouchDist.current = null;

        showTooltipAt(t.clientX, t.clientY);
      } else if (event.touches.length === 2) {
        hideTooltip();
        dragging.current = false;
        const [t0, t1] = [event.touches[0], event.touches[1]];
        lastTouchDist.current = Math.hypot(
          t1.clientX - t0.clientX,
          t1.clientY - t0.clientY,
        );
      }
    },
    [disabled, hideTooltip, pan, showTooltipAt],
  );

  const handleTouchMove = React.useCallback(
    (event: TouchEvent) => {
      if (disabled) return;

      event.preventDefault();

      if (event.touches.length === 1 && lastTouchDist.current === null) {
        const t = event.touches[0];
        const dx = t.clientX - panStart.current.x;
        const dy = t.clientY - panStart.current.y;

        if (!dragging.current && Math.hypot(dx, dy) < TOUCH_DRAG_THRESHOLD) {
          showTooltipAt(t.clientX, t.clientY);
          return;
        }

        if (!dragging.current) {
          dragging.current = true;
          hideTooltip();
        }

        setPan({
          x: panStart.current.panX + dx,
          y: panStart.current.panY + dy,
        });
      } else if (event.touches.length === 2 && lastTouchDist.current !== null) {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const [t0, t1] = [event.touches[0], event.touches[1]];
        const dist = Math.hypot(
          t1.clientX - t0.clientX,
          t1.clientY - t0.clientY,
        );

        const vpRect = viewport.getBoundingClientRect();
        zoomBy(
          dist / lastTouchDist.current,
          (t0.clientX + t1.clientX) / 2 - vpRect.left,
          (t0.clientY + t1.clientY) / 2 - vpRect.top,
        );

        lastTouchDist.current = dist;
      }
    },
    [disabled, hideTooltip, setPan, showTooltipAt, viewportRef, zoomBy],
  );

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        panStart.current = {
          x: touch.clientX,
          y: touch.clientY,
          panX: pan.x,
          panY: pan.y,
        };
      } else if (event.touches.length === 0 && dragging.current) {
        hideTooltip();
      }

      lastTouchDist.current = null;
      dragging.current = false;
    },
    [hideTooltip, pan.x, pan.y],
  );

  return { handleTouchEnd, handleTouchMove, handleTouchStart };
}
