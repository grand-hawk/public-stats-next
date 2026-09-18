import { Box, Skeleton, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import {
  COLUMN_MAX_PX,
  COLUMN_MIN_PX,
  EMPTY_CSS,
  FRAME_CSS,
  TABLE_CSS,
} from '@/components/features/compare/tableStyles';

import type { SectionDef } from '@/components/features/compare/types';

interface ComparisonTableProps<T> {
  addAction?: React.ReactNode;
  emptyMessage: string;
  headerCells: Array<{ key: string; content: React.ReactNode }>;
  items: T[];
  loadingCount?: number;
  sections: SectionDef<T>[];
}

function statValue<T>(
  getter: SectionDef<T>['stats'][number]['getter'],
  item: T,
) {
  try {
    return getter(item) ?? '—';
  } catch {
    return '—';
  }
}

export default function ComparisonTable<T>({
  addAction,
  emptyMessage,
  headerCells,
  items,
  loadingCount = 0,
  sections,
}: ComparisonTableProps<T>) {
  const hasAddColumn = addAction != null;
  const totalColumns = items.length + loadingCount + (hasAddColumn ? 1 : 0);
  const skeletonIndices = Array.from({ length: loadingCount }, (_, i) => i);

  if (items.length === 0 && loadingCount === 0) {
    return (
      <Box
        css={FRAME_CSS}
        style={{
          maxWidth: `calc(var(--compare-label-width) + ${2 * COLUMN_MAX_PX}px)`,
        }}
      >
        <Box css={EMPTY_CSS}>
          <Text color="fg.muted" css={{ fontSize: '0.875rem' }}>
            {emptyMessage}
          </Text>
          {addAction}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      css={FRAME_CSS}
      style={{
        maxWidth: `calc(var(--compare-label-width) + ${totalColumns * COLUMN_MAX_PX}px)`,
      }}
    >
      <chakra.table
        css={TABLE_CSS}
        style={{
          minWidth: `calc(var(--compare-label-width) + ${totalColumns * COLUMN_MIN_PX}px)`,
        }}
      >
        <colgroup>
          <col style={{ width: 'var(--compare-label-width)' }} />
          {Array.from({ length: totalColumns }, (_, i) => (
            <col key={i} />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th />
            {headerCells.map(({ content, key }) => (
              <th key={key}>{content}</th>
            ))}
            {skeletonIndices.map((i) => (
              <th key={`skeleton-header-${i}`}>
                <Skeleton height="120px" width="100%" />
              </th>
            ))}
            {hasAddColumn && <th data-add>{addAction}</th>}
          </tr>
        </thead>

        <tbody>
          {sections.map((section) => (
            <React.Fragment key={section.title}>
              <tr data-group>
                <td>{section.title}</td>

                {section.titleGetter ? (
                  items.map((item, j) => (
                    <td key={j}>{section.titleGetter!(item)}</td>
                  ))
                ) : (
                  <td colSpan={totalColumns} />
                )}

                {section.titleGetter
                  ? skeletonIndices.map((i) => (
                      <td key={`skeleton-title-${i}`} />
                    ))
                  : null}

                {section.titleGetter && hasAddColumn && <td data-add />}
              </tr>

              {section.stats.map((stat) => (
                <tr key={stat.label}>
                  <td>{stat.label}</td>

                  {items.map((item, j) => (
                    <td key={j}>{statValue(stat.getter, item)}</td>
                  ))}

                  {skeletonIndices.map((i) => (
                    <td key={`skeleton-${i}`}>
                      <Skeleton height="14px" width="60%" />
                    </td>
                  ))}

                  {hasAddColumn && <td data-add />}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </chakra.table>
    </Box>
  );
}
