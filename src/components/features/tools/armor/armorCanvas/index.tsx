import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { LuRotateCcw } from 'react-icons/lu';

import { ProgressBar, ProgressRoot } from '@/components/ui/progress';

import { samplePalette } from '../palettes';
import { RICOCHET_DARK, RICOCHET_LIGHT } from '../useArmorProcessor';
import DepthMinimap from './depthMinimap';
import HorizontalLegend from './horizontalLegend';

import type { Palette } from '../palettes';
import type { ArmorAngle } from '@/utils/getVehicleImage';

interface ArmorCanvasProps {
  angle: ArmorAngle;
  canvas: HTMLCanvasElement | null;
  detectedMaxDepth: number;
  downloadProgress: number | null;
  error: string | null;
  loading: boolean;
  maxDepth: number;
  maxMm: number;
  minDepth: number;
  minMm: number;
  onSaveRef: React.MutableRefObject<(() => void) | null>;
  palette: Palette;
  ricochetAngle: number;
  slug: string | null;
  thicknessAt: (x: number, y: number) => number | 'ricochet' | null;
}

const BASE_SCALE_FACTOR = 0.85;
const TOUCH_DRAG_THRESHOLD = 8;

function drawRicochetSwatch(canvas: HTMLCanvasElement, w: number, h: number) {
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d')!;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const stripe = (x + y) % 6 < 2;
      const c = stripe ? RICOCHET_LIGHT : RICOCHET_DARK;
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

export default function ArmorCanvas({
  angle,
  canvas,
  detectedMaxDepth,
  downloadProgress,
  error,
  loading,
  maxDepth,
  maxMm,
  minDepth,
  minMm,
  onSaveRef,
  palette,
  ricochetAngle,
  slug,
  thicknessAt,
}: ArmorCanvasProps) {
  const displayRef = React.useRef<HTMLCanvasElement>(null);
  const minimapRef = React.useRef<HTMLCanvasElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const ricochetSwatchRef = React.useRef<HTMLCanvasElement>(null);

  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const dragStart = React.useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const lastTouchDist = React.useRef<number | null>(null);
  const lastTouchCenter = React.useRef<{ x: number; y: number } | null>(null);
  const touchPanStart = React.useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);

  React.useEffect(() => {
    const element = ricochetSwatchRef.current;
    if (element) drawRicochetSwatch(element, 12, 12);
  }, []);

  const drawCanvas = React.useCallback(() => {
    const display = displayRef.current;
    const viewport = viewportRef.current;
    if (!display || !canvas || !viewport) return;

    const availW = viewport.clientWidth;
    const availH = viewport.clientHeight;
    const baseScale =
      Math.min(availW / canvas.width, availH / canvas.height) *
      BASE_SCALE_FACTOR;

    display.width = Math.floor(canvas.width * baseScale);
    display.height = Math.floor(canvas.height * baseScale);

    const ctx = display.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, display.width, display.height);
    ctx.drawImage(canvas, 0, 0, display.width, display.height);
  }, [canvas]);

  React.useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !canvas) return;
    const observer = new ResizeObserver(() => drawCanvas());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [canvas, drawCanvas]);

  const canvasDims = canvas ? `${canvas.width}x${canvas.height}` : '';
  const prevDimsRef = React.useRef(canvasDims);

  React.useEffect(() => {
    if (canvasDims === prevDimsRef.current) return;

    setZoom(1);
    setPan({ x: 0, y: 0 });

    prevDimsRef.current = canvasDims;
  }, [canvasDims]);

  const getCenterOffset = React.useCallback(() => {
    const display = displayRef.current;
    const viewport = viewportRef.current;
    if (!display || !viewport) return { x: 0, y: 0 };
    return {
      x: (viewport.clientWidth - display.width) / 2,
      y: (viewport.clientHeight - display.height) / 2,
    };
  }, []);

  const updateTooltip = React.useCallback(
    (screenX: number, screenY: number, value: string | null) => {
      const el = tooltipRef.current;
      if (!el) return;
      if (value === null || isDraggingRef.current) {
        el.style.display = 'none';
        return;
      }
      el.style.display = 'block';
      el.style.left = `${screenX + 16}px`;
      el.style.top = `${screenY - 12}px`;
      el.textContent = value;
    },
    [],
  );

  const handleWheel = React.useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      updateTooltip(0, 0, null);

      const display = displayRef.current;
      const viewport = viewportRef.current;
      if (!display || !viewport) return;

      const vpRect = viewport.getBoundingClientRect();
      const cursorX = event.clientX - vpRect.left;
      const cursorY = event.clientY - vpRect.top;

      const center = getCenterOffset();
      const relX = cursorX - center.x;
      const relY = cursorY - center.y;

      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
      const newZoom = Math.max(0.5, Math.min(20, zoom * factor));

      const scale = newZoom / zoom;
      const newPanX = relX - scale * (relX - pan.x);
      const newPanY = relY - scale * (relY - pan.y);

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    },
    [zoom, pan, getCenterOffset, updateTooltip],
  );

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return;
      isDraggingRef.current = true;
      setDragging(true);
      dragStart.current = {
        x: event.clientX,
        y: event.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      updateTooltip(0, 0, null);
    },
    [pan, updateTooltip],
  );

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      if (isDraggingRef.current) {
        const dx = event.clientX - dragStart.current.x;
        const dy = event.clientY - dragStart.current.y;
        setPan({
          x: dragStart.current.panX + dx,
          y: dragStart.current.panY + dy,
        });
        return;
      }

      const display = displayRef.current;
      const viewport = viewportRef.current;
      if (!display || !viewport || !canvas) return;

      const vpRect = viewport.getBoundingClientRect();
      const screenX = event.clientX - vpRect.left;
      const screenY = event.clientY - vpRect.top;

      const canvasRect = display.getBoundingClientRect();
      const canvasX = event.clientX - canvasRect.left;
      const canvasY = event.clientY - canvasRect.top;

      const scaleX = canvas.width / canvasRect.width;
      const scaleY = canvas.height / canvasRect.height;
      const px = canvasX * scaleX;
      const py = canvasY * scaleY;

      const val = thicknessAt(px, py);
      updateTooltip(
        screenX,
        screenY,
        val === null ? null : val === 'ricochet' ? 'Ricochet' : `${val} mm`,
      );
    },
    [canvas, thicknessAt, updateTooltip],
  );

  const handleMouseUp = React.useCallback(() => {
    isDraggingRef.current = false;
    setDragging(false);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    isDraggingRef.current = false;
    setDragging(false);
    updateTooltip(0, 0, null);
  }, [updateTooltip]);

  const touchDragging = React.useRef(false);

  const showTouchTooltip = React.useCallback(
    (clientX: number, clientY: number) => {
      const display = displayRef.current;
      const viewport = viewportRef.current;
      if (!display || !viewport || !canvas) return;

      const vpRect = viewport.getBoundingClientRect();
      const screenX = clientX - vpRect.left;
      const screenY = clientY - vpRect.top;

      const canvasRect = display.getBoundingClientRect();
      const canvasX = clientX - canvasRect.left;
      const canvasY = clientY - canvasRect.top;

      const scaleX = canvas.width / canvasRect.width;
      const scaleY = canvas.height / canvasRect.height;
      const px = canvasX * scaleX;
      const py = canvasY * scaleY;

      const val = thicknessAt(px, py);
      updateTooltip(
        screenX,
        screenY,
        val === null ? null : val === 'ricochet' ? 'Ricochet' : `${val} mm`,
      );
    },
    [canvas, thicknessAt, updateTooltip],
  );

  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();
      if (event.touches.length === 1) {
        const t = event.touches[0];
        touchPanStart.current = {
          x: t.clientX,
          y: t.clientY,
          panX: pan.x,
          panY: pan.y,
        };
        touchDragging.current = false;
        lastTouchDist.current = null;
        lastTouchCenter.current = null;

        showTouchTooltip(t.clientX, t.clientY);
      } else if (event.touches.length === 2) {
        updateTooltip(0, 0, null);
        touchDragging.current = false;
        const t0 = event.touches[0];
        const t1 = event.touches[1];
        const dx = t1.clientX - t0.clientX;
        const dy = t1.clientY - t0.clientY;
        lastTouchDist.current = Math.hypot(dx, dy);
        lastTouchCenter.current = {
          x: (t0.clientX + t1.clientX) / 2,
          y: (t0.clientY + t1.clientY) / 2,
        };
      }
    },
    [pan, showTouchTooltip, updateTooltip],
  );

  const handleTouchMove = React.useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();

      if (event.touches.length === 1 && lastTouchDist.current === null) {
        const t = event.touches[0];
        const dx = t.clientX - touchPanStart.current.x;
        const dy = t.clientY - touchPanStart.current.y;
        const dist = Math.hypot(dx, dy);

        if (!touchDragging.current && dist < TOUCH_DRAG_THRESHOLD) {
          showTouchTooltip(t.clientX, t.clientY);
          return;
        }

        if (!touchDragging.current) {
          touchDragging.current = true;
          updateTooltip(0, 0, null);
        }

        setPan({
          x: touchPanStart.current.panX + dx,
          y: touchPanStart.current.panY + dy,
        });
      } else if (
        event.touches.length === 2 &&
        lastTouchDist.current !== null &&
        lastTouchCenter.current !== null
      ) {
        const t0 = event.touches[0];
        const t1 = event.touches[1];
        const dx = t1.clientX - t0.clientX;
        const dy = t1.clientY - t0.clientY;
        const dist = Math.hypot(dx, dy);

        const viewport = viewportRef.current;
        if (!viewport) return;

        const vpRect = viewport.getBoundingClientRect();
        const centerX = (t0.clientX + t1.clientX) / 2 - vpRect.left;
        const centerY = (t0.clientY + t1.clientY) / 2 - vpRect.top;

        const flexCenter = getCenterOffset();
        const relX = centerX - flexCenter.x;
        const relY = centerY - flexCenter.y;

        const factor = dist / lastTouchDist.current;
        const newZoom = Math.max(0.5, Math.min(20, zoom * factor));
        const scale = newZoom / zoom;

        const newPanX = relX - scale * (relX - pan.x);
        const newPanY = relY - scale * (relY - pan.y);

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });

        lastTouchDist.current = dist;
        lastTouchCenter.current = { x: centerX, y: centerY };
      }
    },
    [zoom, pan, getCenterOffset, showTouchTooltip, updateTooltip],
  );

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length === 1) {
        const t = event.touches[0];
        touchPanStart.current = {
          x: t.clientX,
          y: t.clientY,
          panX: pan.x,
          panY: pan.y,
        };
      } else if (event.touches.length === 0) updateTooltip(0, 0, null);

      lastTouchDist.current = null;
      lastTouchCenter.current = null;
      touchDragging.current = false;
    },
    [pan.x, pan.y, updateTooltip],
  );

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) =>
      handleWheel(event as unknown as React.WheelEvent);
    const onTouchStart = (event: TouchEvent) =>
      handleTouchStart(event as unknown as React.TouchEvent);
    const onTouchMove = (event: TouchEvent) =>
      handleTouchMove(event as unknown as React.TouchEvent);

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);

  const resetView = React.useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    updateTooltip(0, 0, null);
  }, [updateTooltip]);

  const handleSave = React.useCallback(() => {
    if (!canvas) return;

    const pad = 8;
    const titleHeight = 20;
    const legendBarHeight = 12;
    const legendLabelsHeight = 14;
    const textHeaderHeight =
      titleHeight + 4 + legendBarHeight + legendLabelsHeight;
    const mc = minimapRef.current;
    const hasMinimap = mc && mc.width > 0 && mc.height > 0;
    const headerHeight =
      pad + Math.max(textHeaderHeight, hasMinimap ? mc.height : 0) + pad;
    const disclaimerHeight = 20;
    const totalWidth = canvas.width;
    const totalHeight = headerHeight + canvas.height + disclaimerHeight;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = totalWidth;
    exportCanvas.height = totalHeight;
    const ctx = exportCanvas.getContext('2d')!;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    if (hasMinimap) ctx.drawImage(mc, totalWidth - mc.width - pad, pad);

    // title
    let y = pad;
    ctx.fillStyle = '#ccc';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('KE effective thickness at LOS', pad, y + 14);
    y += titleHeight + 4;

    // legend bar
    const legendBarWidth = Math.min(totalWidth - 120 - pad * 2, 300);
    for (let x = 0; x < legendBarWidth; x += 1) {
      const t = x / (legendBarWidth - 1);
      const c = samplePalette(palette, t);
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(pad + x, y, 1, legendBarHeight);
    }

    // ricochet swatch
    if (ricochetAngle !== 90) {
      const swatchX = pad + legendBarWidth + 10;
      for (let sy = 0; sy < legendBarHeight; sy += 1) {
        for (let sx = 0; sx < 10; sx += 1) {
          const stripe = (sx + sy) % 6 < 2;
          const c = stripe ? RICOCHET_LIGHT : RICOCHET_DARK;
          ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
          ctx.fillRect(swatchX + sx, y + sy, 1, 1);
        }
      }

      ctx.fillStyle = '#aaa';
      ctx.font = '10px monospace';
      ctx.fillText(
        `Ricochet (≥${ricochetAngle}°)`,
        swatchX + 14,
        y + legendBarHeight - 1,
      );
    }

    // legend labels
    y += legendBarHeight;
    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    ctx.fillText(`${minMm}`, pad, y + 11);
    const maxLabel = `${maxMm}`;
    ctx.fillText(
      maxLabel,
      pad + legendBarWidth - ctx.measureText(maxLabel).width,
      y + 11,
    );

    // main canvas
    ctx.drawImage(canvas, 0, headerHeight);

    // disclaimer
    ctx.fillStyle = '#666';
    ctx.font = '9px monospace';
    ctx.fillText('Estimated data — not for bug reports', pad, totalHeight - 6);

    const filename = slug
      ? `armor-${slug}-${angle}.png`
      : 'armor-visualization.png';
    const link = document.createElement('a');
    link.download = filename;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }, [canvas, palette, minMm, maxMm, ricochetAngle, slug, angle]);

  React.useEffect(() => {
    onSaveRef.current = handleSave;
    return () => {
      onSaveRef.current = null;
    };
  }, [handleSave, onSaveRef]);

  const isZoomed = zoom !== 1 || pan.x !== 0 || pan.y !== 0;

  if (loading) {
    return (
      <Flex
        alignItems="center"
        flexDirection="column"
        gap={4}
        height="100%"
        justifyContent="center"
        paddingX={8}
      >
        <ProgressRoot
          max={100}
          value={downloadProgress ?? undefined}
          width="100%"
          maxW="320px"
        >
          <ProgressBar borderRadius={0} overflow="hidden" />
        </ProgressRoot>
        <Text color="fg.muted" fontSize="sm">
          Downloading armour data…
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        alignItems="center"
        direction="column"
        gap={2}
        height="100%"
        justifyContent="center"
      >
        <Text color="red.400" fontSize="sm">
          {error}
        </Text>
      </Flex>
    );
  }

  if (!canvas) {
    return (
      <Flex
        alignItems="center"
        direction="column"
        gap={2}
        height="100%"
        justifyContent="center"
      >
        <Text color="fg.muted" fontSize="sm">
          Select a vehicle to get started
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="100%" minHeight="0">
      <Flex
        alignItems="flex-start"
        direction="column"
        flexShrink={0}
        gap={2}
        paddingBottom={2}
        paddingTop={{ base: 3, md: 6 }}
        paddingX={{ base: 3, md: 6 }}
      >
        <Text
          color="fg"
          fontSize="lg"
          fontWeight="medium"
          letterSpacing="wide"
          textTransform="uppercase"
        >
          KE effective thickness at LOS
        </Text>

        <Flex alignItems="center" gap={3} maxWidth="360px" width="100%">
          <HorizontalLegend maxMm={maxMm} minMm={minMm} palette={palette} />

          <Flex alignItems="center" flexShrink={0} gap={1}>
            <canvas
              ref={ricochetSwatchRef}
              style={{
                width: '10px',
                height: '10px',
                imageRendering: 'pixelated',
                display: 'block',
              }}
            />
            <Text color="fg.muted" fontSize="2xs" whiteSpace="nowrap">
              Ricochet (≥{ricochetAngle}°)
            </Text>
          </Flex>
        </Flex>

        {slug && canvas && (
          <DepthMinimap
            ref={minimapRef}
            angle={angle}
            detectedMaxDepth={detectedMaxDepth}
            maxDepth={maxDepth}
            minDepth={minDepth}
            slug={slug}
          />
        )}

        <Box minHeight="24px">
          <Flex
            _hover={{ color: 'fg', background: 'whiteAlpha.100' }}
            alignItems="center"
            as="button"
            borderColor="border.muted"
            borderWidth="1px"
            color="fg.muted"
            cursor={isZoomed ? 'pointer' : 'default'}
            fontSize="2xs"
            gap={1}
            opacity={isZoomed ? 1 : 0}
            paddingX={2}
            paddingY={1}
            pointerEvents={isZoomed ? 'auto' : 'none'}
            visibility={isZoomed ? 'visible' : 'hidden'}
            onClick={resetView}
          >
            <LuRotateCcw size={12} />
            Reset view
          </Flex>
        </Box>
      </Flex>

      <Box
        ref={viewportRef}
        cursor={dragging ? 'grabbing' : 'grab'}
        flex={1}
        minHeight="0"
        overflow="hidden"
        position="relative"
        css={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
        <Flex
          alignItems="center"
          height="100%"
          justifyContent="center"
          pointerEvents="none"
          width="100%"
        >
          <Box
            position="relative"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <canvas
              ref={displayRef}
              style={{
                display: 'block',
                imageRendering: 'pixelated',
              }}
            />
          </Box>
        </Flex>

        <Box
          ref={tooltipRef}
          background="bg.panel"
          borderColor="border.muted"
          borderWidth="1px"
          boxShadow="md"
          display="none"
          fontSize="xs"
          paddingX={2}
          paddingY={1}
          pointerEvents="none"
          position="absolute"
          whiteSpace="nowrap"
          zIndex={20}
        />
      </Box>
    </Flex>
  );
}
