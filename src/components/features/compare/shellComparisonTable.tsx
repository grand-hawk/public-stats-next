import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import {
  COMPARE_MAX_WIDTH_MEDIUM,
  COMPARE_MAX_WIDTH_SMALL,
  MAX_COMPARE_ITEMS,
  SHELL_LIST_ITEM_HEIGHT_PX,
} from '@/components/features/compare';
import AddColumnHeader from '@/components/features/compare/addColumnHeader';
import ColumnHeader from '@/components/features/compare/columnHeader';
import ComparisonGrid from '@/components/features/compare/comparisonGrid';
import { buildShellSections } from '@/components/features/compare/shellStats';
import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';
import { simplifyString } from '@/utils/simplifyString';

import type { DetailedShell } from '@/server/api/trpc/routers/shells';

export interface ShellListItem {
  name: string;
  slug: string;
  weapon: string;
}

export interface ShellComparisonTableProps {
  shells: DetailedShell[];
  allShells: ShellListItem[];
  loadingCount?: number;
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
}

export default function ShellComparisonTable({
  allShells,
  loadingCount = 0,
  onAdd,
  onRemove,
  shells,
}: ShellComparisonTableProps) {
  const sections = React.useMemo(() => buildShellSections(), []);
  const selectedSlugs = React.useMemo(
    () => shells.map((shell) => shell.slug),
    [shells],
  );
  const isFull = shells.length + loadingCount >= MAX_COMPARE_ITEMS;
  const hasAddColumn = !isFull;
  const totalColumns = shells.length + loadingCount + (hasAddColumn ? 1 : 0);

  const maxWidth =
    totalColumns <= 1
      ? COMPARE_MAX_WIDTH_SMALL
      : totalColumns <= 2
        ? COMPARE_MAX_WIDTH_MEDIUM
        : undefined;

  const matchesShellQuery = React.useCallback(
    (shell: ShellListItem, simplified: string) =>
      simplifyString(shell.name).includes(simplified) ||
      simplifyString(shell.weapon).includes(simplified),
    [],
  );

  return (
    <ComparisonGrid<DetailedShell>
      addColumn={
        <AddColumnHeader
          addLabel="Add"
          emptyMessage="No shells found"
          itemHeight={SHELL_LIST_ITEM_HEIGHT_PX}
          items={allShells}
          matchesQuery={matchesShellQuery}
          placeholder="Search..."
          renderItem={(shell) => (
            <Flex
              direction="column"
              flex={1}
              gap={0}
              justifyContent="center"
              minWidth={0}
            >
              <Text fontSize="sm" overflow="hidden" textOverflow="ellipsis">
                {shell.name}
              </Text>
              <Text color="fg.subtle" fontSize="2xs" lineHeight="tight">
                {shell.weapon}
              </Text>
            </Flex>
          )}
          selectedSlugs={selectedSlugs}
          onAdd={onAdd}
        />
      }
      hasAddColumn={hasAddColumn}
      headerCells={shells.map((shell) => {
        const icon = getShellIcon(shell.displayType);
        return {
          key: shell.slug,
          content: (
            <ColumnHeader onRemove={() => onRemove(shell.slug)}>
              {icon && <ShellIcon alt={shell.type} size={20} src={icon} />}
              <Text
                fontSize="sm"
                fontWeight="medium"
                lineHeight="tight"
                truncate
              >
                {shell.name}
              </Text>
            </ColumnHeader>
          ),
        };
      })}
      itemCount={shells.length}
      items={shells}
      loadingCount={loadingCount}
      maxWidth={maxWidth}
      sections={sections.map((sec) => ({
        title: sec.title,
        stats: sec.stats.map((st) => ({
          label: st.label,
          getter: st.getter,
        })),
      }))}
    />
  );
}
