import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { LuChevronLeft, LuChevronRight, LuSave } from 'react-icons/lu';

import DepthMinimap from '@/components/features/tools/armor/armorCanvas/depthMinimap';
import { RangeSlider } from '@/components/features/tools/armor/controls/slider';
import { Button } from '@/components/ui/button';
import { useArmorStore } from '@/stores/armor';

export default function ArmorDebug() {
  const angle = useArmorStore((s) => s.angle);
  const detectedMaxDepth = useArmorStore((s) => s.detectedMaxDepth);
  const maxDepth = useArmorStore((s) => s.maxDepth);
  const minDepth = useArmorStore((s) => s.minDepth);
  const setMaxDepth = useArmorStore((s) => s.setMaxDepth);
  const onSelectVehicle = useArmorStore((s) => s.onSelectVehicle);
  const onSetFrontArmorDepth = useArmorStore((s) => s.onSetFrontArmorDepth);
  const slug = useArmorStore((s) => s.slug);
  const vehicles = useArmorStore((s) => s.vehicles);

  const currentIndex = vehicles.findIndex((v) => v.slug === slug);
  const effectiveMaxDepth = detectedMaxDepth || 100;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(220);
  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);
  const depthPercentage =
    detectedMaxDepth > 0 ? Math.round((maxDepth / detectedMaxDepth) * 100) : 0;

  const handlePrev = React.useCallback(() => {
    if (!onSelectVehicle || vehicles.length === 0) return;
    const newIndex = currentIndex <= 0 ? vehicles.length - 1 : currentIndex - 1;
    onSelectVehicle(vehicles[newIndex]!.slug);
  }, [onSelectVehicle, vehicles, currentIndex]);

  const handleNext = React.useCallback(() => {
    if (!onSelectVehicle || vehicles.length === 0) return;
    const newIndex = currentIndex >= vehicles.length - 1 ? 0 : currentIndex + 1;
    onSelectVehicle(vehicles[newIndex]!.slug);
  }, [onSelectVehicle, vehicles, currentIndex]);

  if (!slug) {
    return (
      <Flex alignItems="center" height="100%" justifyContent="center">
        <Text color="fg.subtle" fontSize="xs">
          Select a vehicle in the armor visualizer
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={3} height="100%" overflowY="auto" padding={3}>
      <Flex alignItems="center" gap={2}>
        <Box
          _hover={{ background: 'whiteAlpha.100', color: 'fg' }}
          as="button"
          borderColor="border.muted"
          borderWidth="1px"
          color="fg.muted"
          cursor="pointer"
          padding={1}
          onClick={handlePrev}
        >
          <LuChevronLeft size={14} />
        </Box>
        <Text
          color="fg.muted"
          flex={1}
          fontSize="xs"
          overflow="hidden"
          textAlign="center"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {vehicles[currentIndex]?.name ?? slug}
          {currentIndex >= 0 && (
            <Text as="span" color="fg.subtle" fontSize="2xs" marginLeft={1}>
              ({currentIndex + 1}/{vehicles.length})
            </Text>
          )}
        </Text>
        <Box
          _hover={{ background: 'whiteAlpha.100', color: 'fg' }}
          as="button"
          borderColor="border.muted"
          borderWidth="1px"
          color="fg.muted"
          cursor="pointer"
          padding={1}
          onClick={handleNext}
        >
          <LuChevronRight size={14} />
        </Box>
      </Flex>

      <Box ref={containerRef} width="100%">
        <DepthMinimap
          angle={angle}
          detectedMaxDepth={detectedMaxDepth}
          maxDepth={maxDepth}
          minDepth={minDepth}
          size={containerWidth}
          slug={slug}
        />
      </Box>

      {angle === 'front' && onSetFrontArmorDepth && (
        <Button
          size="xs"
          variant="surface"
          onClick={() => {
            onSetFrontArmorDepth(depthPercentage);
            handleNext();
          }}
        >
          <LuSave />
          Save {depthPercentage}% depth
        </Button>
      )}

      <div>
        <Flex alignItems="center" marginBottom={2}>
          <Text color="fg.muted" fontSize="xs">
            Max depth
          </Text>
          <Text color="fg" fontSize="xs" marginLeft="auto">
            {depthPercentage}%
          </Text>
        </Flex>
        <RangeSlider
          max={effectiveMaxDepth}
          min={0}
          step={effectiveMaxDepth / 200}
          value={Math.min(maxDepth, effectiveMaxDepth)}
          onChange={(v: number) => setMaxDepth(Math.max(v, minDepth))}
        />
      </div>
    </Flex>
  );
}
