import { Box, Icon, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
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
import { sortedArray } from '@/utils/sortedSet';
import { trpc } from '@/utils/trpc';

import type { SpeedBand } from '@/components/features/vehicles/browse/speedBands';

const OBTAINMENT_LABELS: Record<string, string> = {
  badge: 'Badge',
  coins: 'Premium',
  free: 'Free',
  money: 'Shop',
};

export interface VehiclesSearchProps {
  defaultClassifications?: string[];
}

export default function VehiclesSearch({
  defaultClassifications,
}: VehiclesSearchProps = {}) {
  const place = usePlace()!;

  const [query, setQuery] = React.useState('');

  const [selectedClassifications, setSelectedClassifications] = React.useState<
    Set<string>
  >(() => new Set(defaultClassifications));
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
  const [featureJammer, setFeatureJammer] = React.useState(false);
  const [featureStabilizer, setFeatureStabilizer] = React.useState(false);
  const [featureThermal, setFeatureThermal] = React.useState(false);

  const [facets] = trpc.vehicles.searchFacets.useSuspenseQuery({
    placeId: place.placeId,
  });

  const searchInput = React.useMemo(
    () => ({
      amphibious: featureAmphibious,
      aps: featureAPS,
      classifications: sortedArray(selectedClassifications),
      crewClasses: sortedArray(crewClasses),
      ess: featureESS,
      jammer: featureJammer,
      obtainments: sortedArray(selectedObtainments),
      placeId: place.placeId,
      query,
      speedBands: sortedArray(selectedSpeedBands),
      stabilizer: featureStabilizer,
      thermal: featureThermal,
    }),
    [
      crewClasses,
      featureAPS,
      featureAmphibious,
      featureESS,
      featureJammer,
      featureStabilizer,
      featureThermal,
      place.placeId,
      query,
      selectedClassifications,
      selectedObtainments,
      selectedSpeedBands,
    ],
  );

  const deferredInput = React.useDeferredValue(searchInput);

  const [filtered, filteredQuery] =
    trpc.vehicles.search.useSuspenseQuery(deferredInput);
  const isSearching = filteredQuery.isFetching || searchInput !== deferredInput;

  const hasFilterChips =
    selectedClassifications.size > 0 ||
    selectedSpeedBands.size > 0 ||
    selectedObtainments.size > 0 ||
    crewClasses.size > 0 ||
    featureAPS ||
    featureAmphibious ||
    featureESS ||
    featureJammer ||
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
    setFeatureJammer(false);
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
          {facets.classifications.map(([cls]) => (
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

      {facets.crewClasses.length > 0 && (
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
            {facets.crewClasses.map((cls) => (
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
            featureJammer ||
            featureStabilizer ||
            featureThermal
          }
          title="Features"
          onClear={() => {
            setFeatureAPS(false);
            setFeatureAmphibious(false);
            setFeatureESS(false);
            setFeatureJammer(false);
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
          <ToggleChip
            active={featureJammer}
            onClick={() => setFeatureJammer((p) => !p)}
          >
            Jammer
          </ToggleChip>
        </Box>
      </Box>

      {facets.obtainments.length > 1 && (
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
            {facets.obtainments.map(([obt]) => (
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

          <Box
            as="button"
            alignItems="center"
            aria-hidden={!hasFilters}
            borderColor="whiteAlpha.100"
            borderTopWidth="1px"
            color="fg.subtle"
            cursor={hasFilters ? 'pointer' : 'default'}
            display="flex"
            fontSize="xs"
            gap={1}
            paddingX={3}
            paddingY={1.5}
            pointerEvents={hasFilters ? 'auto' : 'none'}
            tabIndex={hasFilters ? 0 : -1}
            visibility={hasFilters ? 'visible' : 'hidden'}
            width="100%"
            _hover={{ color: 'blue.400' }}
            onClick={clearAll}
          >
            <Icon as={LuX} boxSize="10px" flexShrink={0} />
            clear all filters
            {isSearching && (
              <Spinner
                borderWidth="1px"
                color="fg.subtle"
                marginLeft="auto"
                size="xs"
              />
            )}
          </Box>
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
