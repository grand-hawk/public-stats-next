import { Box } from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slug from 'slug';

import KdrTableHeader from '@/components/features/kdr/table/header';
import KdrTableRow from '@/components/features/kdr/table/row';
import { EmptyState } from '@/components/ui/empty-state';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import { usePlace } from '@/hooks/usePlace';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { trpc } from '@/utils/trpc';

import type { DetailedKdrItem } from '@/server/api/trpc/routers/kdr';
import type { KdrPlaceData } from '@generated/kdr';
import type { SortingState } from '@tanstack/react-table';

const columnHelper = createColumnHelper<DetailedKdrItem>();

const COLUMNS = [
  columnHelper.accessor('vehicle', { header: 'Vehicle' }),
  columnHelper.accessor('kdr', { header: 'K/D', sortDescFirst: true }),
  columnHelper.accessor('kills', { header: 'Kills', sortDescFirst: true }),
  columnHelper.accessor('deaths', { header: 'Deaths', sortDescFirst: true }),
];

export default function KdrTable({ range }: { range: keyof KdrPlaceData }) {
  const place = usePlace()!;
  const initials = usePlaceInitials()!;
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'kdr', desc: true },
  ]);

  const [kdrData] = trpc.kdr.table.useSuspenseQuery({ placeId: place.placeId });
  const kdr = kdrData[range];

  const table = useReactTable({
    data: kdr,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.vehicle,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (kdr.length === 0) {
    return (
      <EmptyState
        icon={<GrDocumentMissing />}
        marginBlockStart="24px"
        title="No K/D data available"
      />
    );
  }

  const showRank =
    sorting.length === 1 && sorting[0].id === 'kdr' && sorting[0].desc;
  const rows = table.getRowModel().rows;

  return (
    <Box
      aria-label={`Vehicle kill death ratio table for ${place.placeName}`}
      className="mtc-frame"
      role="table"
      css={{ ...RAISED_FRAME_CSS, marginBlockStart: '24px' }}
    >
      <KdrTableHeader
        headers={table.getHeaderGroups()[0].headers}
        showRank={showRank}
        sorting={sorting}
      />

      <Box role="rowgroup">
        {rows.map((row, index) => (
          <KdrTableRow
            key={row.id}
            deaths={row.original.deaths}
            href={`/${initials}/vehicles/${slug(row.original.vehicle)}`}
            isLast={index === rows.length - 1}
            kdr={row.original.kdr}
            kills={row.original.kills}
            rank={index + 1}
            showRank={showRank}
            team={row.original.team}
            vehicle={row.original.vehicle}
          />
        ))}
      </Box>
    </Box>
  );
}
