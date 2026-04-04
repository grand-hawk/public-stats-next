import { Box, Icon, IconButton, Input, Text } from '@chakra-ui/react';
import React from 'react';
import { LuSlidersHorizontal, LuX } from 'react-icons/lu';

import { SPEED_BANDS } from '@/components/features/vehicles/browse/speedBands';
import VirtualGrid from '@/components/features/vehicles/browse/virtualGrid';
import { SEARCH_INPUT_HEIGHT } from '@/components/layout/searchLayout/searchSidebar/input';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import SectionLabel from '@/components/ui/sectionLabel';
import ToggleChip from '@/components/ui/toggleChip';
import { usePlace } from '@/hooks/usePlace';
import { simplifyString } from '@/utils/simplifyString';
import { trpc } from '@/utils/trpc';
import { classificationOrder } from '@/utils/vehicleClassification';

import type { SpeedBand } from '@/components/features/vehicles/browse/speedBands';

const OBTAINMENT_LABELS: Record<string, string> = {
  badge: 'Badge',
  coins: 'Premium',
  free: 'Free',
  money: 'Shop',
};

export default function VehiclesSearch() {
  const place = usePlace()!;

  const [query, setQuery] = React.useState('');
  const deferredQuery = React.useDeferredValue(query);

  const [selectedClassifications, setSelectedClassifications] = React.useState<
    Set<string>
  >(() => new Set());
  const [selectedSpeedBands, setSelectedSpeedBands] = React.useState<
    Set<SpeedBand>
  >(() => new Set());
  const [selectedObtainments, setSelectedObtainments] = React.useState<
    Set<string>
  >(() => new Set());
  const [crewClasses, setCrewClasses] = React.useState<Set<string>>(new Set());
  const [featureAPS, setFeatureAPS] = React.useState(false);
  const [featureAmphibious, setFeatureAmphibious] = React.useState(false);
  const [featureESS, setFeatureESS] = React.useState(false);
  const [featureStabilizer, setFeatureStabilizer] = React.useState(false);
  const [featureThermal, setFeatureThermal] = React.useState(false);

  const [vehicleList] = trpc.vehicles.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const { allClasses, classifications, obtainments } = React.useMemo(() => {
    const classMap = new Map<string, number>();
    const obtMap = new Map<string, number>();
    const classSet = new Set<string>();

    for (const v of vehicleList) {
      classMap.set(v.classification, (classMap.get(v.classification) ?? 0) + 1);
      const obtKey = v.premium ?? 'free';
      obtMap.set(obtKey, (obtMap.get(obtKey) ?? 0) + 1);
      for (const c of v.supportedClasses) classSet.add(c);
    }

    return {
      allClasses: [...classSet].sort(),
      classifications: classificationOrder
        .filter((c) => c !== 'Other' && classMap.has(c))
        .map((c) => [c, classMap.get(c)!] as const),
      obtainments: [...obtMap.entries()].sort((a, b) =>
        a[0].localeCompare(b[0]),
      ),
    };
  }, [vehicleList]);

  const simplifiedNames = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const v of vehicleList) map.set(v.slug, simplifyString(v.name));
    return map;
  }, [vehicleList]);

  const filtered = React.useMemo(() => {
    return vehicleList.filter((v) => {
      if (
        selectedClassifications.size > 0 &&
        !selectedClassifications.has(v.classification)
      ) {
        return false;
      }
      if (selectedSpeedBands.size > 0) {
        const inAnyBand = [...selectedSpeedBands].some((key) =>
          SPEED_BANDS.find((b) => b.key === key)?.test(v.forwardSpeed),
        );
        if (!inAnyBand) return false;
      }
      if (
        selectedObtainments.size > 0 &&
        !selectedObtainments.has(v.premium ?? 'free')
      ) {
        return false;
      }
      if (
        crewClasses.size > 0 &&
        !v.supportedClasses.some((c) => crewClasses.has(c))
      ) {
        return false;
      }
      if (featureAPS && !v.hasAPS) return false;
      if (featureAmphibious && !v.amphibious) return false;
      if (featureESS && !v.hasESS) return false;
      if (featureStabilizer && !v.hasStabilizer) return false;
      if (featureThermal && !v.hasThermal) return false;
      if (deferredQuery) {
        const q = simplifyString(deferredQuery);
        if (!simplifiedNames.get(v.slug)!.includes(q)) return false;
      }
      return true;
    });
  }, [
    vehicleList,
    deferredQuery,
    simplifiedNames,
    selectedClassifications,
    selectedSpeedBands,
    selectedObtainments,
    crewClasses,
    featureAPS,
    featureAmphibious,
    featureESS,
    featureStabilizer,
    featureThermal,
  ]);

  const hasFilterChips =
    selectedClassifications.size > 0 ||
    selectedSpeedBands.size > 0 ||
    selectedObtainments.size > 0 ||
    crewClasses.size > 0 ||
    featureAPS ||
    featureAmphibious ||
    featureESS ||
    featureStabilizer ||
    featureThermal;

  const hasFilters = hasFilterChips || !!query;

  function clearAll() {
    setSelectedClassifications(new Set());
    setSelectedSpeedBands(new Set());
    setSelectedObtainments(new Set());
    setCrewClasses(new Set());
    setFeatureAPS(false);
    setFeatureAmphibious(false);
    setFeatureESS(false);
    setFeatureStabilizer(false);
    setFeatureThermal(false);
    setQuery('');
  }

  function toggleCrewClass(cls: string) {
    setCrewClasses((prev) => {
      const next = new Set(prev);
      if (next.has(cls)) next.delete(cls);
      else next.add(cls);
      return next;
    });
  }

  function toggleClassification(cls: string) {
    setSelectedClassifications((prev) => {
      const next = new Set(prev);
      if (next.has(cls)) next.delete(cls);
      else next.add(cls);
      return next;
    });
  }

  function toggleSpeedBand(key: SpeedBand) {
    setSelectedSpeedBands((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleObtainment(obt: string) {
    setSelectedObtainments((prev) => {
      const next = new Set(prev);
      if (next.has(obt)) next.delete(obt);
      else next.add(obt);
      return next;
    });
  }

  const filterSections = (
    <>
      <Box paddingBottom={2}>
        <SectionLabel
          hasActive={selectedClassifications.size > 0}
          title="Class"
          onClear={() => setSelectedClassifications(new Set())}
        />
        <Box display="grid" gap={1} gridTemplateColumns="1fr 1fr" paddingX={3}>
          {classifications.map(([cls]) => (
            <ToggleChip
              key={cls}
              active={selectedClassifications.has(cls)}
              onClick={() => toggleClassification(cls)}
            >
              {cls}
            </ToggleChip>
          ))}
        </Box>
      </Box>

      <Box borderColor="whiteAlpha.100" borderTopWidth="1px" paddingBottom={2}>
        <SectionLabel
          hasActive={selectedSpeedBands.size > 0}
          title="Speed (km/h)"
          onClear={() => setSelectedSpeedBands(new Set())}
        />
        <Box display="grid" gap={1} gridTemplateColumns="1fr 1fr" paddingX={3}>
          {SPEED_BANDS.map((band) => (
            <ToggleChip
              key={band.key}
              active={selectedSpeedBands.has(band.key)}
              onClick={() => toggleSpeedBand(band.key)}
            >
              {band.label}
            </ToggleChip>
          ))}
        </Box>
      </Box>

      {allClasses.length > 0 && (
        <Box
          borderColor="whiteAlpha.100"
          borderTopWidth="1px"
          paddingBottom={2}
        >
          <SectionLabel
            hasActive={crewClasses.size > 0}
            title="Crew class"
            onClear={() => setCrewClasses(new Set())}
          />
          <Box
            display="grid"
            gap={1}
            gridTemplateColumns="1fr 1fr"
            paddingX={3}
          >
            {allClasses.map((cls) => (
              <ToggleChip
                key={cls}
                active={crewClasses.has(cls)}
                onClick={() => toggleCrewClass(cls)}
              >
                {cls}
              </ToggleChip>
            ))}
          </Box>
        </Box>
      )}

      <Box borderColor="whiteAlpha.100" borderTopWidth="1px" paddingBottom={2}>
        <SectionLabel
          hasActive={
            featureAPS ||
            featureAmphibious ||
            featureESS ||
            featureStabilizer ||
            featureThermal
          }
          title="Features"
          onClear={() => {
            setFeatureAPS(false);
            setFeatureAmphibious(false);
            setFeatureESS(false);
            setFeatureStabilizer(false);
            setFeatureThermal(false);
          }}
        />
        <Box display="grid" gap={1} gridTemplateColumns="1fr 1fr" paddingX={3}>
          <ToggleChip
            active={featureAPS}
            onClick={() => setFeatureAPS((p) => !p)}
          >
            APS
          </ToggleChip>
          <ToggleChip
            active={featureThermal}
            onClick={() => setFeatureThermal((p) => !p)}
          >
            Thermal
          </ToggleChip>
          <ToggleChip
            active={featureStabilizer}
            onClick={() => setFeatureStabilizer((p) => !p)}
          >
            Stabilizer
          </ToggleChip>
          <ToggleChip
            active={featureAmphibious}
            onClick={() => setFeatureAmphibious((p) => !p)}
          >
            Amphibious
          </ToggleChip>
          <ToggleChip
            active={featureESS}
            onClick={() => setFeatureESS((p) => !p)}
          >
            ESS
          </ToggleChip>
        </Box>
      </Box>

      {obtainments.length > 1 && (
        <Box
          borderColor="whiteAlpha.100"
          borderTopWidth="1px"
          paddingBottom={3}
        >
          <SectionLabel
            hasActive={selectedObtainments.size > 0}
            title="Obtainment"
            onClear={() => setSelectedObtainments(new Set())}
          />
          <Box display="flex" flexWrap="wrap" gap={1} paddingX={3}>
            {obtainments.map(([obt]) => (
              <ToggleChip
                key={obt}
                active={selectedObtainments.has(obt)}
                onClick={() => toggleObtainment(obt)}
              >
                {OBTAINMENT_LABELS[obt] ?? obt}
              </ToggleChip>
            ))}
          </Box>
        </Box>
      )}
    </>
  );

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', md: '220px 1fr' }}
      height="100%"
      minHeight="0"
      overflow="clip"
    >
      <Box
        borderColor="whiteAlpha.100"
        borderRightWidth="1px"
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        minHeight={0}
        overflow="hidden"
      >
        <Box
          backgroundColor="bg"
          borderBottomWidth="1px"
          borderColor="whiteAlpha.100"
          flexShrink={0}
        >
          <Input
            autoComplete="off"
            borderRadius="none"
            height={SEARCH_INPUT_HEIGHT}
            placeholder="Search..."
            value={query}
            variant="subtle"
            onChange={(e) => setQuery(e.target.value)}
          />
          {hasFilters && (
            <Box
              as="button"
              alignItems="center"
              borderColor="whiteAlpha.100"
              borderTopWidth="1px"
              color="fg.subtle"
              cursor="pointer"
              display="flex"
              fontSize="xs"
              gap={1}
              paddingX={3}
              paddingY={1.5}
              width="100%"
              _hover={{ color: 'blue.400' }}
              onClick={clearAll}
            >
              <Icon as={LuX} boxSize="10px" flexShrink={0} />
              clear all filters
            </Box>
          )}
        </Box>

        <Box flex={1} overflowY="auto">
          {filterSections}
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        minHeight={0}
        overflow="hidden"
      >
        <Box
          alignItems="stretch"
          borderBottomWidth="1px"
          borderColor="whiteAlpha.100"
          display={{ base: 'flex', md: 'none' }}
          flexShrink={0}
        >
          <Input
            autoComplete="off"
            borderRadius="none"
            flex={1}
            height={SEARCH_INPUT_HEIGHT}
            placeholder="Search..."
            value={query}
            variant="subtle"
            onChange={(e) => setQuery(e.target.value)}
          />

          <Box position="relative">
            <DrawerRoot placement="bottom">
              <DrawerTrigger asChild>
                <IconButton
                  aria-label="Filters"
                  backgroundColor="bg.muted"
                  borderRadius="none"
                  height={SEARCH_INPUT_HEIGHT}
                  variant="ghost"
                  width={SEARCH_INPUT_HEIGHT}
                  _hover={{ backgroundColor: 'whiteAlpha.100' }}
                >
                  <LuSlidersHorizontal />
                </IconButton>
              </DrawerTrigger>

              <DrawerBackdrop />

              <DrawerContent maxHeight="75vh">
                <DrawerHeader
                  alignItems="center"
                  borderBottomWidth="1px"
                  display="flex"
                  justifyContent="space-between"
                  paddingEnd={12}
                  paddingY={2.5}
                >
                  <DrawerTitle fontSize="sm">Filters</DrawerTitle>
                  {hasFilterChips && (
                    <Box
                      as="button"
                      alignItems="center"
                      color="fg.subtle"
                      cursor="pointer"
                      display="flex"
                      fontSize="xs"
                      gap={1}
                      _hover={{ color: 'blue.400' }}
                      onClick={clearAll}
                    >
                      <Icon as={LuX} boxSize="10px" />
                      clear all
                    </Box>
                  )}
                </DrawerHeader>

                <DrawerCloseTrigger />

                <DrawerBody overflowY="auto" padding={0}>
                  {filterSections}
                </DrawerBody>
              </DrawerContent>
            </DrawerRoot>

            {hasFilterChips && (
              <Box
                background="blue.400"
                borderRadius="full"
                height="6px"
                pointerEvents="none"
                position="absolute"
                right="6px"
                top="6px"
                width="6px"
              />
            )}
          </Box>
        </Box>

        {filtered.length === 0 ? (
          <Box padding={{ base: 4, md: 5 }}>
            <Text color="fg.subtle" fontSize="sm">
              No vehicles match your filters.
            </Text>
          </Box>
        ) : (
          <VirtualGrid placeInitials={place.initials} vehicles={filtered} />
        )}
      </Box>
    </Box>
  );
}
