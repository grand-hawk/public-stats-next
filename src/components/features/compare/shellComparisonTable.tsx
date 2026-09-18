import { Box, Span, Text } from '@chakra-ui/react';
import React from 'react';

import AddColumn from '@/components/features/compare/addColumn';
import ColumnHeader from '@/components/features/compare/columnHeader';
import ComparisonTable from '@/components/features/compare/comparisonTable';
import {
  MAX_COMPARE_ITEMS,
  SHELL_LIST_ITEM_HEIGHT_PX,
} from '@/components/features/compare/constants';
import { buildShellSections } from '@/components/features/compare/shellStats';
import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';
import { usePlace } from '@/hooks/usePlace';
import { simplifyString } from '@/utils/simplifyString';

import type { DetailedShell } from '@/server/api/trpc/routers/shells';

interface ShellListItem {
  name: string;
  slug: string;
  weapon: string;
}

export default function ShellComparisonTable({
  allShells,
  loadingCount = 0,
  onAdd,
  onRemove,
  shells,
}: {
  allShells: ShellListItem[];
  loadingCount?: number;
  shells: DetailedShell[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
}) {
  const place = usePlace()!;
  const sections = React.useMemo(() => buildShellSections(shells), [shells]);
  const selectedSlugs = React.useMemo(
    () => shells.map((shell) => shell.slug),
    [shells],
  );

  const matchesShellQuery = React.useCallback(
    (shell: ShellListItem, simplified: string) =>
      simplifyString(shell.name).includes(simplified) ||
      simplifyString(shell.weapon).includes(simplified),
    [],
  );

  const isFull = shells.length + loadingCount >= MAX_COMPARE_ITEMS;

  return (
    <ComparisonTable<DetailedShell>
      addAction={
        isFull ? undefined : (
          <AddColumn
            addLabel="Add shell"
            emptyMessage="No shells found"
            itemHeight={SHELL_LIST_ITEM_HEIGHT_PX}
            items={allShells}
            matchesQuery={matchesShellQuery}
            placeholder="Search shells"
            renderItem={(shell) => (
              <Box css={{ minWidth: 0, textAlign: 'start' }}>
                <Text
                  as="span"
                  css={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {shell.name}
                </Text>
                <Span
                  color="fg.muted"
                  css={{
                    display: 'block',
                    fontSize: '0.75rem',
                    lineHeight: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {shell.weapon}
                </Span>
              </Box>
            )}
            selectedSlugs={selectedSlugs}
            onAdd={onAdd}
          />
        )
      }
      emptyMessage="Add two or more shells to compare them."
      headerCells={shells.map((shell) => {
        const icon = getShellIcon(shell.displayType);
        return {
          key: shell.slug,
          content: (
            <ColumnHeader
              href={`/${place.initials}/shells/${shell.slug}`}
              icon={
                icon ? (
                  <ShellIcon alt={shell.type} size={20} src={icon} />
                ) : undefined
              }
              name={shell.name}
              removeLabel={`Remove ${shell.name}`}
              subtitle={shell.weapon}
              onRemove={() => onRemove(shell.slug)}
            />
          ),
        };
      })}
      items={shells}
      loadingCount={loadingCount}
      sections={sections}
    />
  );
}
