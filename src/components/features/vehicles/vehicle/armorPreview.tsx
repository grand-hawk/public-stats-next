import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import React from 'react';
import { LuMaximize2 } from 'react-icons/lu';

import ArmorCanvas from '@/components/features/tools/armor/armorCanvas';
import { palettes } from '@/components/features/tools/armor/palettes';
import { useArmorProcessor } from '@/components/features/tools/armor/useArmorProcessor';
import { useHiddenModules } from '@/components/features/tools/armor/useHiddenModules';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import { useVehicle } from '@/hooks/providers/vehicle';
import { useRouterQuery } from '@/hooks/useRouterQuery';

function isNetworkGood(): boolean {
  const connection = (
    navigator as Navigator & { connection?: { effectiveType?: string } }
  ).connection;
  return connection?.effectiveType === '4g';
}

export default function VehicleArmorPreview({
  frontArmorDepth,
}: {
  frontArmorDepth: number;
}) {
  const vehicle = useVehicle();
  const place = useRouterQuery('place')!;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const onSaveRef = React.useRef<(() => void) | null>(null);

  const { applyDefaults, hiddenModules } = useHiddenModules(vehicle.info.slug);
  const [loaded, setLoaded] = React.useState(false);
  const [maxDepth, setMaxDepth] = React.useState(Infinity);

  const {
    canvas,
    detectedMaxDepth,
    downloadProgress,
    error,
    loading,
    modules,
    thicknessAt,
  } = useArmorProcessor({
    angle: 'front',
    autoRange: true,
    hiddenModules,
    maxDepth,
    maxMm: 1000,
    minDepth: 0,
    minMm: 0,
    overrideData: null,
    palette: palettes[2],
    ricochetAngle: 85,
    slug: loaded ? vehicle.info.slug : null,
  });

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isNetworkGood()) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    applyDefaults(modules);
  }, [applyDefaults, modules]);

  React.useEffect(() => {
    if (detectedMaxDepth > 0) {
      setMaxDepth(detectedMaxDepth * (frontArmorDepth / 100));
    }
  }, [detectedMaxDepth, frontArmorDepth]);

  return (
    <Stack ref={containerRef} gap={3}>
      {!loaded ? (
        <Flex
          alignItems="center"
          direction="column"
          gap={2}
          height="400px"
          justifyContent="center"
          css={RAISED_FRAME_CSS}
        >
          <Box
            _hover={{ background: 'whiteAlpha.100', color: 'fg' }}
            as="button"
            borderColor="border"
            borderRadius="4px"
            borderWidth="1px"
            color="fg.muted"
            cursor="pointer"
            fontSize="sm"
            paddingX={3}
            paddingY={1.5}
            transition="all 0.1s"
            onClick={() => setLoaded(true)}
          >
            Load armour preview
          </Box>
        </Flex>
      ) : (
        <Box css={RAISED_FRAME_CSS} height="400px" overflow="hidden">
          <ArmorCanvas
            angle="front"
            canvas={canvas}
            compact
            detectedMaxDepth={detectedMaxDepth}
            disablePanZoom
            downloadProgress={downloadProgress}
            error={error}
            loading={loading}
            maxDepth={maxDepth}
            maxMm={1000}
            minDepth={0}
            minMm={0}
            onSaveRef={onSaveRef}
            palette={palettes[2]}
            ricochetAngle={85}
            slug={vehicle.info.slug}
            thicknessAt={thicknessAt}
          />
        </Box>
      )}

      <Link
        alignItems="center"
        alignSelf="end"
        display="inline-flex"
        fontSize="sm"
        gap={1.5}
        href={`/${place}/armor?vehicle=${vehicle.info.slug}`}
        css={{
          color: 'var(--color-progressive)',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <LuMaximize2 size={13} />
        Open armour visualizer
      </Link>
    </Stack>
  );
}
