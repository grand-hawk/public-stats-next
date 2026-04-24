import {
  Box,
  Icon,
  IconButton,
  Input,
  Stack,
  StackSeparator,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { LuSlidersHorizontal, LuX } from 'react-icons/lu';

import {
  DAMAGE_BANDS,
  EXP_MASS_BANDS,
  MASS_BANDS,
  PEN_BANDS,
  VEL_BANDS,
} from '@/components/features/shells/browse/filterBands';
import SidebarFilterGroup from '@/components/features/shells/browse/sidebarFilterGroup';
import VirtualShellResults from '@/components/features/shells/browse/virtualShellResults';
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
import UIToggleChip from '@/components/ui/toggleChip';
import { usePlace } from '@/hooks/usePlace';
import { sortedArray } from '@/utils/sortedSet';
import { trpc } from '@/utils/trpc';

import type {
  DamageBand,
  ExpMassBand,
  MassBand,
  PenBand,
  VelBand,
} from '@/components/features/shells/browse/filterBands';
import type { ComponentProps } from 'react';

function ToggleChip(
  props: Omit<ComponentProps<typeof UIToggleChip>, 'accent'>,
) {
  return <UIToggleChip {...props} accent="orange" />;
}

export default function ShellsSearch() {
  const place = usePlace()!;

  const [query, setQuery] = React.useState('');
  const deferredQuery = React.useDeferredValue(query);
  const [selectedMass, setSelectedMass] = React.useState<Set<MassBand>>(
    () => new Set(),
  );
  const [selectedExpMass, setSelectedExpMass] = React.useState<
    Set<ExpMassBand>
  >(() => new Set());
  const [selectedDamage, setSelectedDamage] = React.useState<Set<DamageBand>>(
    () => new Set(),
  );
  const [selectedPen, setSelectedPen] = React.useState<Set<PenBand>>(
    () => new Set(),
  );
  const [selectedVel, setSelectedVel] = React.useState<Set<VelBand>>(
    () => new Set(),
  );
  const [propLaser, setPropLaser] = React.useState(false);
  const [propExplosive, setPropExplosive] = React.useState(false);
  const [propIRCCM, setPropIRCCM] = React.useState(false);
  const [propUnjammable, setPropUnjammable] = React.useState(false);

  const searchInput = React.useMemo(
    () => ({
      damage: sortedArray(selectedDamage),
      explosive: propExplosive,
      explosiveMass: sortedArray(selectedExpMass),
      irccm: propIRCCM,
      laser: propLaser,
      mass: sortedArray(selectedMass),
      penetration: sortedArray(selectedPen),
      placeId: place.placeId,
      query: deferredQuery,
      unjammable: propUnjammable,
      velocity: sortedArray(selectedVel),
    }),
    [
      deferredQuery,
      place.placeId,
      propExplosive,
      propIRCCM,
      propLaser,
      propUnjammable,
      selectedDamage,
      selectedExpMass,
      selectedMass,
      selectedPen,
      selectedVel,
    ],
  );

  const deferredInput = React.useDeferredValue(searchInput);

  const [filtered] = trpc.shells.search.useSuspenseQuery(deferredInput);

  const hasFilterChips = !!(
    selectedMass.size > 0 ||
    selectedExpMass.size > 0 ||
    selectedDamage.size > 0 ||
    selectedPen.size > 0 ||
    selectedVel.size > 0 ||
    propLaser ||
    propExplosive ||
    propIRCCM ||
    propUnjammable
  );

  const hasFilters = hasFilterChips || !!query;

  function clearAll() {
    setSelectedMass(new Set());
    setSelectedExpMass(new Set());
    setSelectedDamage(new Set());
    setSelectedPen(new Set());
    setSelectedVel(new Set());
    setPropLaser(false);
    setPropExplosive(false);
    setPropIRCCM(false);
    setPropUnjammable(false);
  }

  function toggle<T extends string>(
    setter: React.Dispatch<React.SetStateAction<Set<T>>>,
    key: T,
  ) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const filterSections = (
    <Stack
      align="stretch"
      gap={0}
      separator={<StackSeparator borderColor="whiteAlpha.100" />}
    >
      <SidebarFilterGroup
        hasActive={selectedMass.size > 0}
        title="Mass (kg)"
        onClear={() => setSelectedMass(new Set())}
      >
        {MASS_BANDS.map((band) => (
          <ToggleChip
            key={band.key}
            active={selectedMass.has(band.key)}
            onClick={() => toggle(setSelectedMass, band.key)}
          >
            {band.label}
          </ToggleChip>
        ))}
      </SidebarFilterGroup>

      <SidebarFilterGroup
        hasActive={selectedExpMass.size > 0}
        title="Explosive mass (kg)"
        onClear={() => setSelectedExpMass(new Set())}
      >
        {EXP_MASS_BANDS.map((band) => (
          <ToggleChip
            key={band.key}
            active={selectedExpMass.has(band.key)}
            onClick={() => toggle(setSelectedExpMass, band.key)}
          >
            {band.label}
          </ToggleChip>
        ))}
      </SidebarFilterGroup>

      <SidebarFilterGroup
        hasActive={selectedDamage.size > 0}
        title="Damage"
        onClear={() => setSelectedDamage(new Set())}
      >
        {DAMAGE_BANDS.map((band) => (
          <ToggleChip
            key={band.key}
            active={selectedDamage.has(band.key)}
            onClick={() => toggle(setSelectedDamage, band.key)}
          >
            {band.label}
          </ToggleChip>
        ))}
      </SidebarFilterGroup>

      <SidebarFilterGroup
        hasActive={selectedPen.size > 0}
        title="Penetration (mm)"
        onClear={() => setSelectedPen(new Set())}
      >
        {PEN_BANDS.map((band) => (
          <ToggleChip
            key={band.key}
            active={selectedPen.has(band.key)}
            onClick={() => toggle(setSelectedPen, band.key)}
          >
            {band.label}
          </ToggleChip>
        ))}
      </SidebarFilterGroup>

      <SidebarFilterGroup
        hasActive={selectedVel.size > 0}
        title="Velocity (m/s)"
        onClear={() => setSelectedVel(new Set())}
      >
        {VEL_BANDS.map((band) => (
          <ToggleChip
            key={band.key}
            active={selectedVel.has(band.key)}
            onClick={() => toggle(setSelectedVel, band.key)}
          >
            {band.label}
          </ToggleChip>
        ))}
      </SidebarFilterGroup>

      <SidebarFilterGroup
        hasActive={propLaser || propExplosive || propIRCCM || propUnjammable}
        paddingBottom={3}
        title="Properties"
        onClear={() => {
          setPropLaser(false);
          setPropExplosive(false);
          setPropIRCCM(false);
          setPropUnjammable(false);
        }}
      >
        <ToggleChip active={propLaser} onClick={() => setPropLaser((p) => !p)}>
          Laser
        </ToggleChip>

        <ToggleChip
          active={propExplosive}
          onClick={() => setPropExplosive((p) => !p)}
        >
          Explosive
        </ToggleChip>

        <ToggleChip active={propIRCCM} onClick={() => setPropIRCCM((p) => !p)}>
          IRCCM
        </ToggleChip>

        <ToggleChip
          active={propUnjammable}
          onClick={() => setPropUnjammable((p) => !p)}
        >
          Unjammable
        </ToggleChip>
      </SidebarFilterGroup>
    </Stack>
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
              _hover={{ color: 'orange.400' }}
              onClick={clearAll}
            >
              <Icon as={LuX} boxSize="10px" flexShrink={0} />
              clear all filters
            </Box>
          )}
        </Box>

        <Box flex={1} minHeight={0} overflowY="auto">
          {filterSections}
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" minHeight={0} minWidth={0}>
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
                      _hover={{ color: 'orange.400' }}
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
                background="orange.400"
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

        {Object.keys(filtered).length === 0 ? (
          <Box
            backgroundColor="bg"
            flex={1}
            overflowY="auto"
            paddingBottom={6}
            paddingTop={{ base: 4, md: 5 }}
            paddingX={{ base: 4, md: 6 }}
          >
            <Text color="fg.subtle" fontSize="sm">
              No shells match your filters.
            </Text>
          </Box>
        ) : (
          <VirtualShellResults
            filtered={filtered}
            placeInitials={place.initials}
          />
        )}
      </Box>
    </Box>
  );
}
