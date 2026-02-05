import { Box, Flex, Input, Link, NumberInput, Text } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import { LuChevronDown, LuChevronUp, LuDownload } from 'react-icons/lu';

import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import { simplifyString } from '@/utils/simplifyString';

import { palettes } from './palettes';

import type { Palette } from './palettes';
import type { ArmorAngle } from '@/utils/getVehicleImage';

interface VehicleOption {
  name: string;
  slug: string;
}

const ANGLES: { label: string; value: ArmorAngle }[] = [
  { label: 'Front', value: 'front' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Back', value: 'back' },
];

const ITEM_HEIGHT = 34;

export interface ArmorControlsProps {
  angle: ArmorAngle;
  autoRange: boolean;
  detectedMax: number;
  detectedMin: number;
  maxMm: number;
  minMm: number;
  onAngleChange: (angle: ArmorAngle) => void;
  onAutoRangeChange: (v: boolean) => void;
  onMaxChange: (v: number) => void;
  onMinChange: (v: number) => void;
  onPaletteChange: (p: Palette) => void;
  onSave: () => void;
  onSelectVehicle: (slug: string) => void;
  palette: Palette;
  selectedSlug: string | null;
  vehicles: VehicleOption[];
}

const VehicleListItem = React.memo(function VehicleListItem({
  isSelected,
  name,
  onClick,
  slug,
  style,
}: {
  isSelected: boolean;
  name: string;
  onClick: () => void;
  slug: string;
  style: React.CSSProperties;
}) {
  return (
    <Flex
      _hover={{ background: 'whiteAlpha.100' }}
      alignItems="center"
      background={isSelected ? 'whiteAlpha.100' : 'transparent'}
      cursor="pointer"
      fontSize="sm"
      gap={2}
      left={0}
      paddingX={3}
      paddingY={1.5}
      position="absolute"
      right={0}
      style={style}
      top={0}
      onClick={onClick}
    >
      <VehicleIcon size={18} slug={slug} />
      {name}
    </Flex>
  );
});

export default function ArmorControls({
  angle,
  autoRange,
  detectedMax,
  detectedMin,
  maxMm,
  minMm,
  onAngleChange,
  onAutoRangeChange,
  onMaxChange,
  onMinChange,
  onPaletteChange,
  onSave,
  onSelectVehicle,
  palette,
  selectedSlug,
  vehicles,
}: ArmorControlsProps) {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileExpanded, setMobileExpanded] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const filtered = React.useMemo(() => {
    if (!query) return vehicles;
    const simplified = simplifyString(query);
    return vehicles.filter((v) => simplifyString(v.name).includes(simplified));
  }, [vehicles, query]);

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 8,
  });

  const selectedName = React.useMemo(
    () => vehicles.find((v) => v.slug === selectedSlug)?.name ?? '',
    [vehicles, selectedSlug],
  );

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleItemClick = React.useCallback(
    (slug: string) => {
      onSelectVehicle(slug);
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelectVehicle],
  );

  return (
    <Flex
      as="aside"
      borderBottomWidth={{ base: '1px', md: 0 }}
      borderRightWidth={{ base: 0, md: '1px' }}
      direction="column"
      gap={0}
      height={{ base: 'auto', md: '100%' }}
      minHeight="0"
    >
      <Flex
        _hover={{ background: 'whiteAlpha.50' }}
        alignItems="center"
        as="button"
        borderBottomWidth={mobileExpanded ? '1px' : 0}
        cursor="pointer"
        display={{ base: 'flex', md: 'none' }}
        gap={2}
        justifyContent="space-between"
        paddingX={3}
        paddingY={2.5}
        onClick={() => setMobileExpanded((v) => !v)}
      >
        <Flex alignItems="center" gap={2}>
          {selectedSlug && <VehicleIcon size={18} slug={selectedSlug} />}
          <Text fontSize="sm" fontWeight="medium">
            {selectedName || 'Settings'}
          </Text>
          <Text color="fg.muted" fontSize="xs">
            · {ANGLES.find((a) => a.value === angle)?.label}
          </Text>
        </Flex>
        {mobileExpanded ? (
          <LuChevronUp size={16} />
        ) : (
          <LuChevronDown size={16} />
        )}
      </Flex>

      <Box
        display={{ base: 'grid', md: 'flex' }}
        flex={{ md: 1 }}
        minHeight="0"
        overflow="hidden"
        style={{
          gridTemplateRows: mobileExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.2s ease-out',
        }}
      >
        <Flex
          direction="column"
          flex={{ md: 1 }}
          minHeight="0"
          overflow="hidden"
        >
          <Box
            ref={containerRef}
            borderBottomWidth="1px"
            padding={3}
            position="relative"
          >
            <Text color="fg.muted" fontSize="xs" marginBottom={1}>
              Vehicle
            </Text>
            <Box position="relative">
              <Input
                ref={inputRef}
                background="transparent"
                borderColor="border.muted"
                borderRadius="0"
                borderWidth="1px"
                fontSize="sm"
                height="32px"
                paddingLeft="8px"
                paddingRight="36px"
                placeholder="Search vehicles..."
                size="sm"
                value={isOpen ? query : selectedName}
                width="100%"
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!isOpen) setIsOpen(true);
                }}
                onFocus={() => {
                  setIsOpen(true);
                  setQuery('');
                }}
              />
              {selectedSlug && (
                <Flex
                  alignItems="center"
                  height="100%"
                  pointerEvents="none"
                  position="absolute"
                  right="8px"
                  top={0}
                >
                  <VehicleIcon slug={selectedSlug} />
                </Flex>
              )}

              {isOpen && (
                <Box
                  ref={listRef}
                  background="bg.panel"
                  borderColor="border.muted"
                  borderWidth="1px"
                  boxShadow="lg"
                  left={0}
                  maxHeight="280px"
                  overflowY="auto"
                  position="absolute"
                  right={0}
                  top="calc(100% - 1px)"
                  zIndex={50}
                >
                  {filtered.length === 0 ? (
                    <Text color="fg.muted" fontSize="sm" padding={3}>
                      No vehicles found
                    </Text>
                  ) : (
                    <Box
                      position="relative"
                      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                    >
                      {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const v = filtered[virtualItem.index];
                        return (
                          <VehicleListItem
                            key={v.slug}
                            isSelected={v.slug === selectedSlug}
                            name={v.name}
                            style={{
                              height: `${virtualItem.size}px`,
                              transform: `translateY(${virtualItem.start}px)`,
                            }}
                            onClick={() => handleItemClick(v.slug)}
                            slug={v.slug}
                          />
                        );
                      })}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          <Flex
            direction="column"
            flex={1}
            gap={0}
            overflowY={{ base: 'hidden', md: 'auto' }}
          >
            <Box borderBottomWidth="1px" padding={3}>
              <Text color="fg.muted" fontSize="xs" marginBottom={1}>
                Angle
              </Text>
              <Flex gap={0} width="100%">
                {ANGLES.map((a) => (
                  <Box
                    key={a.value}
                    as="button"
                    background={
                      angle === a.value ? 'whiteAlpha.200' : 'transparent'
                    }
                    borderWidth="1px"
                    color={angle === a.value ? 'fg' : 'fg.muted'}
                    cursor="pointer"
                    flex={1}
                    fontSize="xs"
                    fontWeight={angle === a.value ? 'medium' : 'normal'}
                    marginLeft="-1px"
                    paddingX={2}
                    paddingY={1.5}
                    textAlign="center"
                    transition="all 0.1s"
                    _first={{ marginLeft: 0 }}
                    _hover={{ background: 'whiteAlpha.100', color: 'fg' }}
                    onClick={() => onAngleChange(a.value)}
                  >
                    {a.label}
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* range */}
            <Box borderBottomWidth="1px" padding={3}>
              <Flex alignItems="center" marginBottom={1}>
                <Text color="fg.muted" fontSize="xs">
                  Range (mm)
                </Text>
                <Box
                  as="button"
                  background={autoRange ? 'teal.500/15' : 'whiteAlpha.50'}
                  borderColor={autoRange ? 'teal.500/40' : 'border.muted'}
                  borderWidth="1px"
                  color={autoRange ? 'teal.300' : 'fg.muted'}
                  cursor="pointer"
                  fontSize="2xs"
                  lineHeight="1"
                  marginLeft="auto"
                  paddingX={1.5}
                  paddingY={0.5}
                  transition="all 0.1s"
                  _hover={{
                    background: autoRange ? 'teal.500/25' : 'whiteAlpha.100',
                  }}
                  onClick={() => onAutoRangeChange(!autoRange)}
                >
                  {autoRange ? 'AUTO' : 'MANUAL'}
                </Box>
              </Flex>

              <Flex alignItems="center" gap={2}>
                <NumberInput.Root
                  borderRadius="0"
                  disabled={autoRange}
                  min={0}
                  size="sm"
                  value={String(autoRange ? detectedMin : minMm)}
                  width="100%"
                  onValueChange={(d) => onMinChange(Number(d.value))}
                >
                  <NumberInput.Input borderRadius="0" />
                </NumberInput.Root>
                <Text color="fg.muted" fontSize="sm" flexShrink={0}>
                  —
                </Text>
                <NumberInput.Root
                  borderRadius="0"
                  disabled={autoRange}
                  min={0}
                  size="sm"
                  value={String(autoRange ? detectedMax : maxMm)}
                  width="100%"
                  onValueChange={(d) => onMaxChange(Number(d.value))}
                >
                  <NumberInput.Input borderRadius="0" />
                </NumberInput.Root>
              </Flex>
            </Box>

            <Box padding={3}>
              <Text color="fg.muted" fontSize="xs" marginBottom={2}>
                Palette
              </Text>
              <Flex direction="column" gap={1}>
                {palettes.map((p) => (
                  <Flex
                    key={p.name}
                    _hover={{ background: 'whiteAlpha.100' }}
                    alignItems="center"
                    borderColor={
                      palette.name === p.name ? 'teal.500' : 'transparent'
                    }
                    borderWidth="2px"
                    cursor="pointer"
                    gap={3}
                    padding={1.5}
                    onClick={() => onPaletteChange(p)}
                  >
                    <Box
                      css={{
                        background: `linear-gradient(to right, ${p.stops.map((s, i) => `rgb(${s.r},${s.g},${s.b}) ${(i / (p.stops.length - 1)) * 100}%`).join(', ')})`,
                      }}
                      flexShrink={0}
                      height="16px"
                      width="48px"
                    />
                    <Text color="fg.muted" fontSize="xs">
                      {p.name}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>

            <Box borderTopWidth="1px" padding={3}>
              <Flex
                _hover={{ color: 'fg', background: 'whiteAlpha.100' }}
                alignItems="center"
                as="button"
                borderColor="border.muted"
                borderWidth="1px"
                color="fg.muted"
                cursor="pointer"
                fontSize="xs"
                gap={2}
                justifyContent="center"
                paddingX={3}
                paddingY={1.5}
                width="100%"
                onClick={onSave}
              >
                <LuDownload size={14} />
                Save image
              </Flex>
            </Box>

            <Box borderTopWidth="1px" marginTop="auto" padding={3}>
              <Text color="fg.subtle" fontSize="2xs" lineHeight="1.4">
                The provided visualization may not be used for bug reports, use
                the armor tools in-game instead. Data is estimated and may not
                be accurate. If data differs significantly from in-game, you may
                report this as a bug in the{' '}
                <Link
                  color="fg.muted"
                  href="https://discord.gg/multicrew"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  Discord
                </Link>
                .
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
