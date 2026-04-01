import { Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import ShellCard from '@/components/features/shells/browse/card';
import WeaponHeader from '@/components/features/shells/browse/weaponHeader';

import type {
  ListedShellForBrowse,
  ShellsListForBrowse,
} from '@/server/api/trpc/routers/shells';

const EST_HEADER = 52;
const EST_HEADER_AFTER_FIRST = 104;
const EST_GRID_ROW = 188;
const WEAPON_SECTION_GAP = 12;

type FlatRow =
  | { isFirstWeapon: boolean; kind: 'header'; weapon: string }
  | { isLastInWeapon: boolean; kind: 'grid'; shells: ListedShellForBrowse[] };

export default function VirtualShellResults({
  filtered,
  placeInitials,
}: {
  filtered: ShellsListForBrowse;
  placeInitials: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [columns, setColumns] = React.useState(3);

  React.useLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    function columnCountForWidth(width: number) {
      if (width < 480) return 1;
      if (width < 1280) return 2;
      return 3;
    }
    setColumns(columnCountForWidth(scrollElement.clientWidth));

    const resizeObserver = new ResizeObserver(([entry]) => {
      setColumns(columnCountForWidth(entry.contentRect.width));
    });
    resizeObserver.observe(scrollElement);
    return () => resizeObserver.disconnect();
  }, []);

  const flatRows = React.useMemo(() => {
    const rows: FlatRow[] = [];

    const entries = Object.entries(filtered);
    for (let weaponIndex = 0; weaponIndex < entries.length; weaponIndex++) {
      const [weapon, shells] = entries[weaponIndex]!;
      const isFirstWeapon = weaponIndex === 0;

      rows.push({
        isFirstWeapon,
        kind: 'header',
        weapon,
      });

      const numGridRows = Math.ceil(shells.length / columns);
      for (let gridRowIndex = 0; gridRowIndex < numGridRows; gridRowIndex++) {
        const start = gridRowIndex * columns;
        rows.push({
          isLastInWeapon: gridRowIndex === numGridRows - 1,
          kind: 'grid',
          shells: shells.slice(start, start + columns),
        });
      }
    }

    return rows;
  }, [columns, filtered]);

  const virtualizer = useVirtualizer({
    count: flatRows.length,
    estimateSize: (index) => {
      const row = flatRows[index];
      if (!row) return EST_GRID_ROW;

      if (row.kind === 'header') {
        return row.isFirstWeapon ? EST_HEADER : EST_HEADER_AFTER_FIRST;
      }

      const trailingSpace = row.isLastInWeapon ? 0 : 12;
      return EST_GRID_ROW + trailingSpace;
    },
    getItemKey: (index) => {
      const row = flatRows[index];
      if (!row) return String(index);

      if (row.kind === 'header') return `h:${row.weapon}`;

      return `g:${row.shells.map((shell) => shell.slug).join(':')}`;
    },
    getScrollElement: () => scrollRef.current,
    overscan: 4,
  });

  return (
    <Box
      ref={scrollRef}
      backgroundColor="bg"
      flex={1}
      minHeight={0}
      overflowY="auto"
      paddingBottom={6}
      paddingTop={{ base: 4, md: 5 }}
      paddingX={{ base: 4, md: 6 }}
    >
      <Box
        position="relative"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = flatRows[virtualRow.index];
          if (!row) return null;

          if (row.kind === 'header') {
            return (
              <Box
                key={virtualRow.key}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
                paddingTop={row.isFirstWeapon ? 0 : WEAPON_SECTION_GAP}
                position="absolute"
                left={0}
                right={0}
                top={0}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <WeaponHeader weapon={row.weapon} />
              </Box>
            );
          }

          return (
            <Box
              key={virtualRow.key}
              ref={virtualizer.measureElement}
              data-index={virtualRow.index}
              display="grid"
              gap="12px"
              paddingBottom={row.isLastInWeapon ? 0 : '12px'}
              position="absolute"
              left={0}
              right={0}
              top={0}
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {row.shells.map((shell) => (
                <ShellCard
                  key={shell.slug}
                  damage={shell.damage}
                  displayType={shell.displayType}
                  href={`/${placeInitials}/shells/${shell.slug}`}
                  maxPenetration={shell.maxPenetration}
                  name={shell.name}
                  velocity={shell.velocity}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
