import { Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import VehicleCard from '@/components/features/vehicles/browse/card';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

const GRID_GAP = 12;
const ROW_HEIGHT = 163 + GRID_GAP;
const MIN_CARD_WIDTH_PX = 260;
const MAX_COLUMNS = 4;

export default function VirtualGrid({
  placeInitials,
  vehicles,
}: {
  placeInitials: string;
  vehicles: ListVehicle[];
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [columns, setColumns] = React.useState(1);

  React.useLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    function columnCountForWidth(width: number) {
      for (let n = MAX_COLUMNS; n >= 1; n -= 1) {
        const gapTotal = (n - 1) * GRID_GAP;
        const cell = (width - gapTotal) / n;
        if (cell >= MIN_CARD_WIDTH_PX) return n;
      }
      return 1;
    }
    setColumns(columnCountForWidth(scrollElement.clientWidth));

    const resizeObserver = new ResizeObserver(([entry]) => {
      setColumns(columnCountForWidth(entry.contentRect.width));
    });
    resizeObserver.observe(scrollElement);
    return () => resizeObserver.disconnect();
  }, []);

  const rowCount = Math.ceil(vehicles.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => scrollRef.current,
    overscan: 3,
  });

  return (
    <Box
      ref={scrollRef}
      flex={1}
      overflowY="auto"
      paddingBottom={5}
      paddingTop={4}
      paddingX={{ base: 4, md: 5 }}
    >
      <Box
        position="relative"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowVehicles = vehicles.slice(startIndex, startIndex + columns);
          return (
            <Box
              key={virtualRow.key}
              columnGap={`${GRID_GAP}px`}
              display="grid"
              left={0}
              paddingBottom={`${GRID_GAP}px`}
              position="absolute"
              right={0}
              rowGap={0}
              top={0}
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.slug}
                  href={`/${placeInitials}/vehicles/${vehicle.slug}`}
                  isNew={vehicle.new}
                  name={vehicle.name}
                  premium={vehicle.premium}
                  role={vehicle.role}
                  slug={vehicle.slug}
                  team={vehicle.team}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
