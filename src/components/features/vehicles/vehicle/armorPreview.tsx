import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import React from 'react';
import { LuMaximize2 } from 'react-icons/lu';

import ArmorCanvas from '@/components/features/tools/armor/armorCanvas';
import { groupModules } from '@/components/features/tools/armor/moduleGroups';
import { palettes } from '@/components/features/tools/armor/palettes';
import { useArmorProcessor } from '@/components/features/tools/armor/useArmorProcessor';
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
  frontArmorDepth: number | null | undefined;
}) {
  const vehicle = useVehicle();
  const place = useRouterQuery('place')!;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const onSaveRef = React.useRef<(() => void) | null>(null);

  const [hiddenModules, setHiddenModules] = React.useState<ReadonlySet<number>>(
    () => new Set(),
  );
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
    palette: palettes[0],
    ricochetAngle: 85,
    slug: loaded && frontArmorDepth != null ? vehicle.info.slug : null,
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
    if (!modules.length) return;
    const hidden = new Set<number>();
    for (const group of groupModules(modules)) {
      if (group.initiallyHidden) {
        for (const idx of group.indices) hidden.add(idx);
      }
    }
    setHiddenModules(hidden);
  }, [modules]);

  React.useEffect(() => {
    if (detectedMaxDepth > 0 && frontArmorDepth != null) {
      setMaxDepth(detectedMaxDepth * (frontArmorDepth / 100));
    }
  }, [detectedMaxDepth, frontArmorDepth]);

  if (frontArmorDepth == null) return null;

  return (
    <Stack ref={containerRef} gap={3}>
      {!loaded ? (
        <Flex
          alignItems="center"
          borderColor="border.muted"
          borderWidth="1px"
          direction="column"
          gap={2}
          height="400px"
          justifyContent="center"
        >
          <Box
            _hover={{ background: 'whiteAlpha.100', color: 'fg' }}
            as="button"
            borderColor="border.muted"
            borderWidth="1px"
            color="fg.muted"
            cursor="pointer"
            fontSize="xs"
            paddingX={3}
            paddingY={1.5}
            transition="all 0.1s"
            onClick={() => setLoaded(true)}
          >
            Load armour preview
          </Box>
        </Flex>
      ) : (
        <Box height="400px">
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
            palette={palettes[0]}
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
      >
        <LuMaximize2 size={13} />
        Open armour visualizer
      </Link>
    </Stack>
  );
}
