import React from 'react';

import { useTouchGestures } from '@/components/features/tools/armor/armorCanvas/useTouchGestures';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 20;

interface UsePanZoomOptions {
  disabled?: boolean;
  displayRef: React.RefObject<HTMLCanvasElement | null>;
  hideTooltip: () => void;
  resetKey: string;
  showTooltipAt: (clientX: number, clientY: number) => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

export function usePanZoom({
  disabled,
  displayRef,
  hideTooltip,
  resetKey,
  showTooltipAt,
  viewportRef,
}: UsePanZoomOptions) {
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);

  const dragStart = React.useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const isDraggingRef = React.useRef(false);
  const prevResetKeyRef = React.useRef(resetKey);

  React.useEffect(() => {
    if (resetKey === prevResetKeyRef.current) return;

    setZoom(1);
    setPan({ x: 0, y: 0 });

    prevResetKeyRef.current = resetKey;
  }, [resetKey]);

  const zoomBy = React.useCallback(
    (factor: number, anchorX: number, anchorY: number) => {
      const display = displayRef.current;
      const viewport = viewportRef.current;
      const center =
        display && viewport
          ? {
              x: (viewport.clientWidth - display.width) / 2,
              y: (viewport.clientHeight - display.height) / 2,
            }
          : { x: 0, y: 0 };

      const relX = anchorX - center.x;
      const relY = anchorY - center.y;

      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));
      const scale = newZoom / zoom;

      setZoom(newZoom);
      setPan({
        x: relX - scale * (relX - pan.x),
        y: relY - scale * (relY - pan.y),
      });
    },
    [displayRef, pan, viewportRef, zoom],
  );

  const handleWheel = React.useCallback(
    (event: WheelEvent) => {
      if (disabled) return;

      event.preventDefault();
      hideTooltip();

      const display = displayRef.current;
      const viewport = viewportRef.current;
      if (!display || !viewport) return;

      const vpRect = viewport.getBoundingClientRect();
      zoomBy(
        event.deltaY < 0 ? 1.15 : 1 / 1.15,
        event.clientX - vpRect.left,
        event.clientY - vpRect.top,
      );
    },
    [disabled, displayRef, hideTooltip, viewportRef, zoomBy],
  );

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (disabled || event.button !== 0) return;

      isDraggingRef.current = true;
      setDragging(true);
      dragStart.current = {
        x: event.clientX,
        y: event.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      hideTooltip();
    },
    [disabled, hideTooltip, pan],
  );

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      if (isDraggingRef.current) {
        setPan({
          x: dragStart.current.panX + (event.clientX - dragStart.current.x),
          y: dragStart.current.panY + (event.clientY - dragStart.current.y),
        });
        return;
      }

      showTooltipAt(event.clientX, event.clientY);
    },
    [showTooltipAt],
  );

  const handleMouseUp = React.useCallback(() => {
    isDraggingRef.current = false;
    setDragging(false);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    isDraggingRef.current = false;
    setDragging(false);
    hideTooltip();
  }, [hideTooltip]);

  const { handleTouchEnd, handleTouchMove, handleTouchStart } =
    useTouchGestures({
      disabled,
      hideTooltip,
      pan,
      setPan,
      showTooltipAt,
      viewportRef,
      zoomBy,
    });

  React.useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, viewportRef]);

  const resetView = React.useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    hideTooltip();
  }, [hideTooltip]);

  return {
    dragging,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    handleTouchEnd,
    isZoomed: zoom !== 1 || pan.x !== 0 || pan.y !== 0,
    pan,
    resetView,
    zoom,
  };
}
