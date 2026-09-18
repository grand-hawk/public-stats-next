import React from 'react';

import type { PixelTooltipData } from '@/components/features/tools/armor/useArmorProcessor';

function formatTooltip(val: PixelTooltipData): string {
  if (val.total === 0 && val.moduleHits.length > 0) {
    return val.moduleHits.map((h) => h.name).join(', ');
  }

  let text = `${val.total} mm`;
  if (val.moduleHits.length > 0) {
    text +=
      ' · ' +
      val.moduleHits
        .map((h) => (h.thickness > 0 ? `${h.name} (${h.thickness}mm)` : h.name))
        .join(', ');
  }

  return text;
}

interface UseCanvasTooltipOptions {
  canvas: HTMLCanvasElement | null;
  displayRef: React.RefObject<HTMLCanvasElement | null>;
  thicknessAt: (x: number, y: number) => PixelTooltipData | 'ricochet' | null;
}

export function useCanvasTooltip({
  canvas,
  displayRef,
  thicknessAt,
}: UseCanvasTooltipOptions) {
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const hide = React.useCallback(() => {
    const element = tooltipRef.current;
    if (element) element.style.display = 'none';
  }, []);

  const showAt = React.useCallback(
    (clientX: number, clientY: number) => {
      const element = tooltipRef.current;
      const display = displayRef.current;
      if (!element || !display || !canvas) return;

      const canvasRect = display.getBoundingClientRect();
      const scaleX = canvas.width / canvasRect.width;
      const scaleY = canvas.height / canvasRect.height;

      const val = thicknessAt(
        (clientX - canvasRect.left) * scaleX,
        (clientY - canvasRect.top) * scaleY,
      );

      if (val === null) {
        element.style.display = 'none';
        return;
      }

      element.style.display = 'block';
      element.style.left = `${clientX + 16}px`;
      element.style.top = `${clientY - 12}px`;
      element.textContent =
        val === 'ricochet' ? 'Ricochet' : formatTooltip(val);
    },
    [canvas, displayRef, thicknessAt],
  );

  React.useEffect(() => {
    window.addEventListener('scroll', hide, { passive: true });
    document.addEventListener('scroll', hide, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener('scroll', hide);
      document.removeEventListener('scroll', hide, { capture: true });
    };
  }, [hide]);

  return { hide, showAt, tooltipRef };
}
