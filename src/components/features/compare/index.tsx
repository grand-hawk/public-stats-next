import { Box, Flex, Stack } from '@chakra-ui/react';
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from 'nuqs';
import React, { Suspense } from 'react';
import { GiArtilleryShell } from 'react-icons/gi';
import { TbTank } from 'react-icons/tb';

import { CenterSpinner } from '@/components/common/spinners';
import ModeButton from '@/components/features/compare/modeButton';
import ShellComparisonTable from '@/components/features/compare/shellComparisonTable';
import VehicleComparisonTable from '@/components/features/compare/vehicleComparisonTable';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

import type { DetailedShell } from '@/server/api/trpc/routers/shells';
import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

const tabParser = parseAsStringLiteral(['vehicles', 'shells']).withDefault(
  'vehicles',
);
const slugsParser = parseAsArrayOf(parseAsString).withDefault([]);

export const MAX_COMPARE_ITEMS = 3;
export const HEADER_ROW_HEIGHT = 11;
export const VEHICLE_LIST_ITEM_HEIGHT_PX = 34;
export const SHELL_LIST_ITEM_HEIGHT_PX = 46;
export const COMPARE_MAX_WIDTH_SMALL = '25rem';
export const COMPARE_MAX_WIDTH_MEDIUM = '37.5rem';

function VehicleDataLoader({
  children,
  slugs,
}: {
  slugs: string[];
  children: (
    vehicles: DetailedVehicle[],
    loadingCount: number,
  ) => React.ReactNode;
}) {
  const place = usePlace()!;

  const queries = trpc.useQueries((t) =>
    slugs.map((slug) => t.vehicles.bySlug({ placeId: place.placeId, slug })),
  );

  const loadingCount = queries.filter((q) => q.isLoading).length;
  const vehicles = queries
    .map((q) => q.data)
    .filter((vehicle): vehicle is DetailedVehicle => vehicle != null);

  return <>{children(vehicles, loadingCount)}</>;
}

function ShellDataLoader({
  children,
  slugs,
}: {
  slugs: string[];
  children: (shells: DetailedShell[], loadingCount: number) => React.ReactNode;
}) {
  const place = usePlace()!;

  const queries = trpc.useQueries((t) =>
    slugs.map((slug) => t.shells.bySlug({ placeId: place.placeId, slug })),
  );

  const loadingCount = queries.filter((q) => q.isLoading).length;
  const shells = queries
    .map((q) => q.data)
    .filter((s): s is DetailedShell => s != null);

  return <>{children(shells, loadingCount)}</>;
}

export default function VehicleComparison() {
  const place = usePlace()!;
  const [mode, setMode] = useQueryState('tab', tabParser);
  const [vehicleSlugs, setVehicleSlugs] = useQueryState(
    'vehicles',
    slugsParser,
  );
  const [shellSlugs, setShellSlugs] = useQueryState('shells', slugsParser);

  const [vehicleList] = trpc.vehicles.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const [shellsList] = trpc.shells.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const flatShells = React.useMemo(() => {
    const result: Array<{ name: string; slug: string; weapon: string }> = [];
    for (const [weapon, shells] of Object.entries(shellsList)) {
      for (const shell of shells) {
        result.push({ name: shell.name, slug: shell.slug, weapon });
      }
    }
    return result;
  }, [shellsList]);

  const selectedVehicleSlugs = vehicleSlugs.slice(0, MAX_COMPARE_ITEMS);
  const selectedShellSlugs = shellSlugs.slice(0, MAX_COMPARE_ITEMS);

  const handleAddVehicle = React.useCallback(
    (slug: string) => {
      setVehicleSlugs((prev) => {
        if (prev.includes(slug)) return prev;
        return [...prev, slug].slice(0, MAX_COMPARE_ITEMS);
      });
    },
    [setVehicleSlugs],
  );

  const handleRemoveVehicle = React.useCallback(
    (slug: string) => {
      setVehicleSlugs((prev) => prev.filter((s) => s !== slug));
    },
    [setVehicleSlugs],
  );

  const handleAddShell = React.useCallback(
    (slug: string) => {
      setShellSlugs((prev) => {
        if (prev.includes(slug)) return prev;
        return [...prev, slug].slice(0, MAX_COMPARE_ITEMS);
      });
    },
    [setShellSlugs],
  );

  const handleRemoveShell = React.useCallback(
    (slug: string) => {
      setShellSlugs((prev) => prev.filter((s) => s !== slug));
    },
    [setShellSlugs],
  );

  return (
    <Stack gap={0} width="100%" height="100%" overflow="auto">
      <Flex
        borderBottomWidth="1px"
        gap={1}
        paddingX={{ base: 2, md: 3 }}
        paddingY={2}
      >
        <ModeButton
          active={mode === 'vehicles'}
          onClick={() => {
            setMode('vehicles');
            setShellSlugs(null);
          }}
        >
          <TbTank size={16} />
          Vehicles
        </ModeButton>
        <ModeButton
          active={mode === 'shells'}
          onClick={() => {
            setMode('shells');
            setVehicleSlugs(null);
          }}
        >
          <GiArtilleryShell size={16} />
          Shells
        </ModeButton>
      </Flex>

      <Box
        maxWidth="5xl"
        marginX="auto"
        paddingY={{ base: 2, md: 3 }}
        paddingX={{ base: 2, md: 3 }}
        width="100%"
      >
        {mode === 'vehicles' ? (
          <Suspense fallback={<CenterSpinner />}>
            <VehicleDataLoader slugs={selectedVehicleSlugs}>
              {(vehicles, loadingCount) => (
                <VehicleComparisonTable
                  allVehicles={vehicleList}
                  loadingCount={loadingCount}
                  vehicles={vehicles}
                  onAdd={handleAddVehicle}
                  onRemove={handleRemoveVehicle}
                />
              )}
            </VehicleDataLoader>
          </Suspense>
        ) : (
          <Suspense fallback={<CenterSpinner />}>
            <ShellDataLoader slugs={selectedShellSlugs}>
              {(shells, loadingCount) => (
                <ShellComparisonTable
                  allShells={flatShells}
                  loadingCount={loadingCount}
                  shells={shells}
                  onAdd={handleAddShell}
                  onRemove={handleRemoveShell}
                />
              )}
            </ShellDataLoader>
          </Suspense>
        )}
      </Box>
    </Stack>
  );
}
