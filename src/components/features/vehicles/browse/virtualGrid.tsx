import { Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import VehicleCard from '@/components/features/vehicles/browse/card';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

const ROW_GAP = 12;
const ROW_HEIGHT = 163 + ROW_GAP;

export default function VirtualGrid({
  placeInitials,
  vehicles,
}: {
  placeInitials: string;
  vehicles: ListVehicle[];
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [columns, setColumns] = React.useState(3);

  React.useLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    function columnCountForWidth(width: number) {
      return Math.min(4, Math.max(2, Math.floor(width / 185)));
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
              display="grid"
              gap={`${ROW_GAP}px`}
              left={0}
              paddingBottom={`${ROW_GAP}px`}
              position="absolute"
              right={0}
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
