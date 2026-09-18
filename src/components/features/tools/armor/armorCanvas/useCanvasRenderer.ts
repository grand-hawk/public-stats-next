import React from 'react';

const BASE_SCALE_FACTOR = 0.85;

export function useCanvasRenderer(
  canvas: HTMLCanvasElement | null,
  displayRef: React.RefObject<HTMLCanvasElement | null>,
  viewportRef: React.RefObject<HTMLDivElement | null>,
) {
  const drawCanvas = React.useCallback(() => {
    const display = displayRef.current;
    const viewport = viewportRef.current;
    if (!display || !canvas || !viewport) return;

    const baseScale =
      Math.min(
        viewport.clientWidth / canvas.width,
        viewport.clientHeight / canvas.height,
      ) * BASE_SCALE_FACTOR;

    display.width = Math.floor(canvas.width * baseScale);
    display.height = Math.floor(canvas.height * baseScale);

    const ctx = display.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, display.width, display.height);
    ctx.drawImage(canvas, 0, 0, display.width, display.height);
  }, [canvas, displayRef, viewportRef]);

  React.useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !canvas) return;
    const observer = new ResizeObserver(() => drawCanvas());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [canvas, drawCanvas, viewportRef]);
}
