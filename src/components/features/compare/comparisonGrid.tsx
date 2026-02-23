import { Box, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import { HEADER_ROW_HEIGHT } from '@/components/features/compare';

import type { SectionDef } from '@/components/features/compare/types';

const COLUMN_MIN_WIDTH = '140px';

export interface ComparisonGridProps<T> {
  itemCount: number;
  hasAddColumn: boolean;
  headerCells: Array<{ key: string; content: React.ReactNode }>;
  addColumn: React.ReactNode;
  sections: SectionDef<T>[];
  items: T[];
  loadingCount?: number;
  maxWidth?: string;
}

export default function ComparisonGrid<T>({
  addColumn,
  hasAddColumn,
  headerCells,
  itemCount,
  items,
  loadingCount = 0,
  maxWidth,
  sections,
}: ComparisonGridProps<T>) {
  const totalColumns = itemCount + loadingCount + (hasAddColumn ? 1 : 0);
  const skeletonIndices = Array.from({ length: loadingCount }, (_, i) => i);

  return (
    <Box
      backgroundColor="bg.panel"
      borderBottomWidth="1px"
      borderLeftWidth={{ base: 0, md: '1px' }}
      borderRightWidth={{ base: 0, md: '1px' }}
      borderTopWidth={{ base: 0, md: '1px' }}
      maxWidth={maxWidth}
      overflowX="auto"
      width="100%"
    >
      <Box
        display="grid"
        css={{
          gridTemplateColumns: `auto repeat(${totalColumns}, minmax(${COLUMN_MIN_WIDTH}, 1fr))`,
        }}
        minWidth="fit-content"
      >
        <Box
          background="bg.panel"
          height={HEADER_ROW_HEIGHT}
          left={0}
          position="sticky"
          zIndex={1}
        />
        {headerCells.map(({ content, key }) => (
          <Box key={key} borderLeftWidth="1px">
            {content}
          </Box>
        ))}
        {skeletonIndices.map((i) => (
          <Box
            key={`skeleton-header-${i}`}
            alignItems="center"
            borderLeftWidth="1px"
            display="flex"
            height={HEADER_ROW_HEIGHT}
            justifyContent="center"
            paddingX={3}
          >
            <Skeleton height="4" width="70%" />
          </Box>
        ))}
        {hasAddColumn && (
          <Box borderLeftWidth="1px" position="relative">
            {addColumn}
          </Box>
        )}

        <Box borderBottomWidth="1px" css={{ gridColumn: '1 / -1' }} />

        {sections.map((section, sectionIdx) => (
          <React.Fragment key={section.title}>
            {sectionIdx > 0 && (
              <Box borderBottomWidth="1px" css={{ gridColumn: '1 / -1' }} />
            )}

            <Box background="bg.panel" left={0} position="sticky" zIndex={1}>
              <Text fontSize="sm" fontWeight="medium" paddingX={3} paddingY={2}>
                {section.title}
              </Text>
            </Box>

            {section.titleGetter
              ? items.map((item, j) => (
                  <Box
                    key={j}
                    alignItems="center"
                    borderLeftWidth="1px"
                    display="flex"
                    fontSize="sm"
                    justifyContent="center"
                    paddingX={3}
                    paddingY={2}
                  >
                    {section.titleGetter!(item)}
                  </Box>
                ))
              : null}

            {section.titleGetter
              ? skeletonIndices.map((i) => (
                  <Box key={`skeleton-title-${i}`} borderLeftWidth="1px" />
                ))
              : null}

            {section.titleGetter && hasAddColumn && (
              <Box borderLeftWidth="1px" />
            )}

            {!section.titleGetter && (
              <Box
                css={{
                  gridColumn: `2 / -1`,
                }}
              />
            )}

            <Box borderBottomWidth="1px" css={{ gridColumn: '1 / -1' }} />

            {section.stats.map((stat, i) => {
              const isLast = i === section.stats.length - 1;
              return (
                <React.Fragment key={stat.label}>
                  <Box
                    alignItems="center"
                    background="bg.panel"
                    borderBottomWidth={isLast ? 0 : '1px'}
                    borderStyle="dashed"
                    color="fg.muted"
                    display="flex"
                    fontSize="sm"
                    left={0}
                    paddingLeft={3}
                    paddingRight={4}
                    paddingY={2}
                    position="sticky"
                    whiteSpace="nowrap"
                    zIndex={1}
                  >
                    {stat.label}
                  </Box>

                  {items.map((item, j) => {
                    let value: React.ReactNode;
                    try {
                      value = stat.getter(item);
                    } catch {
                      value = '—';
                    }

                    return (
                      <Box
                        key={j}
                        alignItems="center"
                        borderBottomWidth={isLast ? 0 : '1px'}
                        borderLeftWidth="1px"
                        borderStyle="dashed"
                        display="flex"
                        fontSize="sm"
                        justifyContent="center"
                        paddingX={3}
                        paddingY={2}
                      >
                        {value ?? '—'}
                      </Box>
                    );
                  })}

                  {skeletonIndices.map((i) => (
                    <Box
                      key={`skeleton-${i}`}
                      alignItems="center"
                      borderBottomWidth={isLast ? 0 : '1px'}
                      borderLeftWidth="1px"
                      borderStyle="dashed"
                      display="flex"
                      justifyContent="center"
                      paddingX={3}
                      paddingY={2}
                    >
                      <Skeleton height="3.5" width="60%" />
                    </Box>
                  ))}

                  {hasAddColumn && (
                    <Box
                      borderBottomWidth={isLast ? 0 : '1px'}
                      borderLeftWidth="1px"
                      borderStyle="dashed"
                      fontSize="sm"
                      paddingX={3}
                      paddingY={2}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
