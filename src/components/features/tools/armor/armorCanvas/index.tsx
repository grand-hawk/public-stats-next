import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import { LuRotateCcw } from 'react-icons/lu';

import { RICOCHET_COLOR, samplePalette } from '../palettes';
import HorizontalLegend from './horizontalLegend';

import type { Palette } from '../palettes';

interface ArmorCanvasProps {
  canvas: HTMLCanvasElement | null;
  error: string | null;
  loading: boolean;
  maxMm: number;
  minMm: number;
  onSaveRef: React.MutableRefObject<(() => void) | null>;
  palette: Palette;
  thicknessAt: (x: number, y: number) => number | 'ricochet' | null;
}

const BASE_SCALE_FACTOR = 0.85;
const TOUCH_DRAG_THRESHOLD = 8;

export default function ArmorCanvas({
  canvas,
  error,
  loading,
  maxMm,
  minMm,
  onSaveRef,
  palette,
  thicknessAt,
}: ArmorCanvasProps) {
  const displayRef = React.useRef<HTMLCanvasElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const dragStart = React.useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const lastTouchDist = React.useRef<number | null>(null);
  const lastTouchCenter = React.useRef<{ x: number; y: number } | null>(null);
  const touchPanStart = React.useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);

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

  React.useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [canvas]);

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

  const handleTouchEnd = React.useCallback(() => {
    lastTouchDist.current = null;
    lastTouchCenter.current = null;
    touchDragging.current = false;
  }, []);

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

    const legendHeight = 24;
    const labelHeight = 28;
    const disclaimerHeight = 20;
    const totalWidth = canvas.width;
    const totalHeight =
      canvas.height + labelHeight + legendHeight + disclaimerHeight;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = totalWidth;
    exportCanvas.height = totalHeight;
    const ctx = exportCanvas.getContext('2d')!;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    ctx.fillStyle = '#ccc';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('KE effective thickness at LOS', 4, 18);

    ctx.drawImage(canvas, 0, labelHeight);

    const legendY = labelHeight + canvas.height + 4;
    const legendBarWidth = Math.min(totalWidth - 120, 300);
    for (let x = 0; x < legendBarWidth; x++) {
      const t = x / (legendBarWidth - 1);
      const c = samplePalette(palette, t);
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(x, legendY, 1, 10);
    }

    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    ctx.fillText(`${minMm}`, 0, legendY + 20);
    ctx.fillText(`${maxMm}`, legendBarWidth - 10, legendY + 20);

    ctx.fillStyle = `rgb(${RICOCHET_COLOR.r},${RICOCHET_COLOR.g},${RICOCHET_COLOR.b})`;
    ctx.fillRect(legendBarWidth + 10, legendY, 8, 10);
    ctx.fillStyle = '#aaa';
    ctx.fillText('Ricochet', legendBarWidth + 22, legendY + 10);

    ctx.fillStyle = '#666';
    ctx.font = '9px monospace';
    ctx.fillText('Estimated data — not for bug reports', 4, totalHeight - 4);

    const link = document.createElement('a');
    link.download = 'armor-visualization.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }, [canvas, palette, minMm, maxMm]);

  React.useEffect(() => {
    onSaveRef.current = handleSave;
    return () => {
      onSaveRef.current = null;
    };
  }, [handleSave, onSaveRef]);

  const isZoomed = zoom !== 1 || pan.x !== 0 || pan.y !== 0;

  if (loading)
    return (
      <Flex alignItems="center" height="100%" justifyContent="center">
        <Spinner size="lg" />
      </Flex>
    );

  if (error)
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

  if (!canvas)
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
            <Box
              background={`rgb(${RICOCHET_COLOR.r},${RICOCHET_COLOR.g},${RICOCHET_COLOR.b})`}
              height="10px"
              width="10px"
            />
            <Text color="fg.muted" fontSize="2xs">
              Ricochet
            </Text>
          </Flex>
        </Flex>

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
