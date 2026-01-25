import { Box, IconButton, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { LuX } from 'react-icons/lu';

import ProvidersDebug from '@/components/development/providers';
import { useDevelopmentStore } from '@/stores/development';

export default function DevelopmentOverlay() {
  const isOverlayOpen = useDevelopmentStore((s) => s.isOverlayOpen);
  const position = useDevelopmentStore((s) => s.position);
  const size = useDevelopmentStore((s) => s.size);
  const setPosition = useDevelopmentStore((s) => s.setPosition);
  const setSize = useDevelopmentStore((s) => s.setSize);
  const toggleOverlay = useDevelopmentStore((s) => s.toggleOverlay);

  const [isDraggingState, setIsDraggingState] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragInfoRef = React.useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    initialLeft: number;
    initialTop: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0,
  });
  const lastSyncedSize = React.useRef({ width: 0, height: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    dragInfoRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: rect.left,
      initialTop: rect.top,
    };

    setIsDraggingState(true);
  };

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const info = dragInfoRef.current;
      if (!info.isDragging || !containerRef.current) return;

      const deltaX = e.clientX - info.startX;
      const deltaY = e.clientY - info.startY;

      const rect = containerRef.current.getBoundingClientRect();
      const newLeft = Math.max(
        0,
        Math.min(info.initialLeft + deltaX, window.innerWidth - rect.width),
      );
      const newTop = Math.max(
        0,
        Math.min(info.initialTop + deltaY, window.innerHeight - rect.height),
      );

      containerRef.current.style.left = `${newLeft}px`;
      containerRef.current.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      const info = dragInfoRef.current;
      if (info.isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
      }
      info.isDragging = false;
      setIsDraggingState(false);
    };

    if (isDraggingState) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDraggingState, setPosition]);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        let width = 0;
        let height = 0;

        if (entry.borderBoxSize && entry.borderBoxSize[0]) {
          width = Math.round(entry.borderBoxSize[0].inlineSize);
          height = Math.round(entry.borderBoxSize[0].blockSize);
        } else {
          const rect = entry.target.getBoundingClientRect();
          width = Math.round(rect.width);
          height = Math.round(rect.height);
        }

        if (
          Math.abs(width - lastSyncedSize.current.width) > 2 ||
          Math.abs(height - lastSyncedSize.current.height) > 2
        ) {
          lastSyncedSize.current = { width, height };
          setSize({ width, height });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [setSize]);

  React.useEffect(() => {
    if (!isOverlayOpen || isDraggingState) return;

    const clamp = () => {
      const { x, y } = useDevelopmentStore.getState().position;
      const { height, width } = useDevelopmentStore.getState().size;

      const newWidth = Math.min(width, window.innerWidth);
      const newHeight = Math.min(height, window.innerHeight);

      const newLeft = Math.max(0, Math.min(x, window.innerWidth - newWidth));
      const newTop = Math.max(0, Math.min(y, window.innerHeight - newHeight));

      if (newLeft !== x || newTop !== y) setPosition({ x: newLeft, y: newTop });
      if (newWidth !== width || newHeight !== height)
        setSize({ width: newWidth, height: newHeight });
    };

    window.addEventListener('resize', clamp);
    clamp();

    return () => window.removeEventListener('resize', clamp);
  }, [isOverlayOpen, isDraggingState, setPosition, setSize]);

  if (!isOverlayOpen) return null;

  return (
    <Box
      backgroundColor="bg.panel"
      borderWidth="1px"
      boxShadow="lg"
      boxSizing="border-box"
      height={`${size.height}px`}
      left={`${position.x}px`}
      maxHeight="100vh"
      maxWidth="100vw"
      minHeight="100px"
      minWidth="200px"
      overflow="hidden"
      position="fixed"
      ref={containerRef}
      resize="both"
      top={`${position.y}px`}
      width={`${size.width}px`}
      zIndex="popover"
      transition="none"
    >
      <Flex
        alignItems="center"
        backgroundColor="bg.muted"
        borderBottomWidth="1px"
        cursor="move"
        justifyContent="space-between"
        onMouseDown={onMouseDown}
        height="32px"
        userSelect="none"
      >
        <Text fontSize="xs" paddingLeft={3}>
          Debug
        </Text>

        <IconButton
          aria-label="Close overlay"
          onClick={() => toggleOverlay()}
          size="xs"
          height="inherit"
          variant="plain"
        >
          <LuX />
        </IconButton>
      </Flex>

      <Box height="calc(100% - 32px)" overflow="hidden">
        <ProvidersDebug />
      </Box>
    </Box>
  );
}
