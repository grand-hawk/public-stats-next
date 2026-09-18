import { Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import ShellRow, {
  HEADING_HEIGHT,
  ROW_HEIGHT,
  ShellColumnsRow,
} from '@/components/features/shells/browse/row';
import WeaponHeader from '@/components/features/shells/browse/weaponHeader';
import { useScrollElement } from '@/hooks/useScrollElement';

import type {
  ListedShellForBrowse,
  ShellsListForBrowse,
} from '@/server/api/trpc/routers/shells';

type FlatRow =
  | { kind: 'columns'; weapon: string }
  | { kind: 'heading'; weapon: string }
  | { isLast: boolean; kind: 'shell'; shell: ListedShellForBrowse };

export default function VirtualShellResults({
  filtered,
  placeInitials,
}: {
  filtered: ShellsListForBrowse;
  placeInitials: string;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const scrollElement = useScrollElement(listRef);
  const [scrollMargin, setScrollMargin] = React.useState(0);

  const flatRows = React.useMemo(() => {
    const rows: FlatRow[] = [];

    for (const [weapon, shells] of Object.entries(filtered)) {
      rows.push({ kind: 'heading', weapon });
      rows.push({ kind: 'columns', weapon });
      shells.forEach((shell, index) => {
        rows.push({
          isLast: index === shells.length - 1,
          kind: 'shell',
          shell,
        });
      });
    }

    return rows;
  }, [filtered]);

  React.useLayoutEffect(() => {
    const node = listRef.current;
    if (!node || !scrollElement) return;

    const measure = () => {
      const offset =
        node.getBoundingClientRect().top -
        scrollElement.getBoundingClientRect().top +
        scrollElement.scrollTop;
      setScrollMargin(offset);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scrollElement);
    return () => observer.disconnect();
  }, [scrollElement]);

  const virtualizer = useVirtualizer({
    count: flatRows.length,
    estimateSize: (index) =>
      flatRows[index]?.kind === 'heading' ? HEADING_HEIGHT : ROW_HEIGHT,
    getItemKey: (index) => {
      const row = flatRows[index];
      if (!row) return String(index);
      if (row.kind === 'heading') return `h:${row.weapon}`;
      if (row.kind === 'columns') return `c:${row.weapon}`;
      return `s:${row.shell.slug}`;
    },
    getScrollElement: () => scrollElement,
    overscan: 8,
    scrollMargin,
  });

  return (
    <Box
      ref={listRef}
      position="relative"
      style={{ height: `${virtualizer.getTotalSize()}px` }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const row = flatRows[virtualRow.index];
        if (!row) return null;

        return (
          <Box
            key={virtualRow.key}
            left={0}
            position="absolute"
            right={0}
            top={0}
            style={{
              transform: `translateY(${virtualRow.start - scrollMargin}px)`,
            }}
          >
            {row.kind === 'heading' && <WeaponHeader weapon={row.weapon} />}
            {row.kind === 'columns' && <ShellColumnsRow />}
            {row.kind === 'shell' && (
              <ShellRow
                damage={row.shell.damage}
                displayType={row.shell.displayType}
                href={`/${placeInitials}/shells/${row.shell.slug}`}
                isLast={row.isLast}
                maxPenetration={row.shell.maxPenetration}
                name={row.shell.name}
                velocity={row.shell.velocity}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
