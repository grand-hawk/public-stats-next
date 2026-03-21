import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { LuChevronLeft, LuChevronRight, LuSave } from 'react-icons/lu';

import DepthMinimap from '@/components/features/tools/armor/armorCanvas/depthMinimap';
import { Button } from '@/components/ui/button';
import { IS_DEV } from '@/env';
import { useArmorStore } from '@/stores/armor';

export default function ArmorDebug() {
  const angle = useArmorStore((s) => s.angle);
  const detectedMaxDepth = useArmorStore((s) => s.detectedMaxDepth);
  const maxDepth = useArmorStore((s) => s.maxDepth);
  const minDepth = useArmorStore((s) => s.minDepth);
  const onSelectVehicle = useArmorStore((s) => s.onSelectVehicle);
  const onSetFrontArmorDepth = useArmorStore((s) => s.onSetFrontArmorDepth);
  const slug = useArmorStore((s) => s.slug);
  const vehicles = useArmorStore((s) => s.vehicles);

  const currentIndex = vehicles.findIndex((v) => v.slug === slug);
  const missingInitialDepth = React.useMemo(
    () => vehicles.filter((v) => v.frontArmorDepth == null),
    [vehicles],
  );

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
  const depthPercent =
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
            onSetFrontArmorDepth(depthPercent);
            handleNext();
          }}
        >
          <LuSave />
          Save {depthPercent}% depth
        </Button>
      )}

      {IS_DEV && (
        <Box>
          <Text color="fg.muted" fontSize="xs" marginBottom={2}>
            These vehicles don&apos;t have initial depth yet
          </Text>
          {missingInitialDepth.length === 0 ? (
            <Text color="fg.subtle" fontSize="2xs">
              None
            </Text>
          ) : (
            <Box
              as="ul"
              display="flex"
              flexDirection="column"
              gap={1}
              listStyleType="none"
              margin={0}
              maxHeight="160px"
              overflowY="auto"
              padding={0}
            >
              {missingInitialDepth.map((v) => (
                <Box
                  as="li"
                  key={v.slug}
                  _hover={
                    onSelectVehicle
                      ? { background: 'whiteAlpha.50' }
                      : undefined
                  }
                  borderRadius="sm"
                  cursor={onSelectVehicle ? 'pointer' : 'default'}
                  onClick={() => onSelectVehicle?.(v.slug)}
                  paddingX={1}
                  paddingY={0.5}
                >
                  <Text
                    color="fg"
                    fontSize="2xs"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {v.name}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Flex>
  );
}
