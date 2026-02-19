import {
  Checkbox,
  createListCollection,
  Portal,
  Select,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineCheck } from 'react-icons/md';

import {
  COMPARE_MAX_WIDTH_MEDIUM,
  COMPARE_MAX_WIDTH_SMALL,
  MAX_COMPARE_ITEMS,
  VEHICLE_LIST_ITEM_HEIGHT_PX,
} from '@/components/features/compare';
import AddColumnHeader from '@/components/features/compare/addColumnHeader';
import ColumnHeader from '@/components/features/compare/columnHeader';
import ComparisonGrid from '@/components/features/compare/comparisonGrid';
import { buildVehicleSections } from '@/components/features/compare/vehicleStats';
import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import {
  alterationHasChanges,
  alterationIsConflicting,
  assembleModules,
} from '@/utils/alterations';
import { simplifyString } from '@/utils/simplifyString';

import type { SectionDef } from '@/components/features/compare/types';
import type { AssembledVehicle } from '@/components/features/compare/vehicleStats';
import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

const NO_LOADOUT = '<none>';

function getSelectedLoadout(
  vehicle: DetailedVehicle,
  enabledAlterations: Record<string, boolean>,
): string | null {
  for (const name of Object.keys(vehicle.alterations.loadouts)) {
    if (enabledAlterations[name]) return name;
  }
  return null;
}

export interface VehicleComparisonTableProps {
  vehicles: DetailedVehicle[];
  allVehicles: ListVehicle[];
  loadingCount?: number;
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
}

export default function VehicleComparisonTable({
  allVehicles,
  loadingCount = 0,
  onAdd,
  onRemove,
  vehicles,
}: VehicleComparisonTableProps) {
  const [alterationsMap, setAlterationsMap] = React.useState<
    Record<string, Record<string, boolean>>
  >({});

  const handleAlterationsChange = React.useCallback(
    (slug: string, alterations: Record<string, boolean>) => {
      setAlterationsMap((prev) => ({ ...prev, [slug]: alterations }));
    },
    [],
  );

  const assembled = React.useMemo<AssembledVehicle[]>(
    () =>
      vehicles.map((vehicle) => {
        const enabled = alterationsMap[vehicle.info.slug] ?? {};
        return {
          vehicle,
          modules: assembleModules(vehicle, enabled),
          enabledAlterations: enabled,
          onAlterationsChange: (alts: Record<string, boolean>) =>
            handleAlterationsChange(vehicle.info.slug, alts),
        };
      }),
    [vehicles, alterationsMap, handleAlterationsChange],
  );

  const statSections = React.useMemo(() => buildVehicleSections(), []);
  const selectedSlugs = React.useMemo(
    () => vehicles.map((vehicle) => vehicle.info.slug),
    [vehicles],
  );
  const isFull = vehicles.length + loadingCount >= MAX_COMPARE_ITEMS;
  const hasAddColumn = !isFull;
  const totalColumns = vehicles.length + loadingCount + (hasAddColumn ? 1 : 0);

  const maxWidth =
    totalColumns <= 1
      ? COMPARE_MAX_WIDTH_SMALL
      : totalColumns <= 2
        ? COMPARE_MAX_WIDTH_MEDIUM
        : undefined;

  const matchesVehicleQuery = React.useCallback(
    (vehicle: ListVehicle, simplified: string) =>
      simplifyString(vehicle.name).includes(simplified),
    [],
  );

  const allLoadoutNames = React.useMemo(() => {
    const names = new Set<string>();
    for (const v of vehicles) {
      for (const name of Object.keys(v.alterations.loadouts)) {
        names.add(name);
      }
    }
    return [...names].sort();
  }, [vehicles]);

  const allAddonNames = React.useMemo(() => {
    const names = new Set<string>();
    for (const v of vehicles) {
      for (const [name, addon] of Object.entries(v.alterations.addons)) {
        if (alterationHasChanges(addon)) names.add(name);
      }
    }
    return [...names].sort();
  }, [vehicles]);

  const gridSections = React.useMemo(() => {
    const mapSection = (s: SectionDef<AssembledVehicle>) => ({
      title: s.title,
      stats: s.stats.map((st) => ({
        label: st.label,
        getter: (a: AssembledVehicle) => st.getter(a),
      })),
    });

    const [generalSection, ...restSections] = statSections;
    const sections: SectionDef<AssembledVehicle>[] = [
      mapSection(generalSection),
    ];

    if (allLoadoutNames.length > 0) {
      sections.push({
        title: 'Loadout',
        stats: [
          {
            label: 'Loadout',
            getter: (a) => {
              const vehicleLoadouts = a.vehicle.alterations.loadouts;
              const hasAny = Object.keys(vehicleLoadouts).length > 0;
              if (!hasAny) return '—';

              const selected = getSelectedLoadout(
                a.vehicle,
                a.enabledAlterations,
              );

              const collection = createListCollection({
                items: [
                  { value: NO_LOADOUT, label: 'None' },
                  ...Object.keys(vehicleLoadouts).map((name) => ({
                    value: name,
                    label: name,
                  })),
                ],
              });

              return (
                <Select.Root
                  collection={collection}
                  lazyMount
                  size="xs"
                  value={selected ? [selected] : [NO_LOADOUT]}
                  width="100%"
                  onValueChange={(details) => {
                    const value = details.value[0];
                    const next: Record<string, boolean> = {};
                    if (value !== NO_LOADOUT) next[value] = true;
                    for (const [name, enabled] of Object.entries(
                      a.enabledAlterations,
                    )) {
                      if (name in vehicleLoadouts) continue;
                      if (enabled) next[name] = true;
                    }
                    a.onAlterationsChange(next);
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup paddingInline={2}>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {collection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              );
            },
          },
        ],
      });
    }

    if (allAddonNames.length > 0) {
      sections.push({
        title: 'Addons',
        titleGetter: (a) => {
          let total = 0;
          for (const addonName of allAddonNames) {
            if (!a.enabledAlterations[addonName]) continue;
            const addon = a.vehicle.alterations.addons[addonName];
            if (addon?.cost) total += addon.cost;
          }
          return total > 0 ? (
            <Text color="fg.muted" fontSize="xs">
              {total} pts
            </Text>
          ) : null;
        },
        stats: allAddonNames.map((addonName) => ({
          label: addonName.replace(/\(cosmetic\)$/i, '').trim(),
          getter: (a: AssembledVehicle) => {
            const addon = a.vehicle.alterations.addons[addonName];
            if (!addon || !alterationHasChanges(addon)) return null;

            const isEnabled = !!a.enabledAlterations[addonName];
            const selectedLoadout = getSelectedLoadout(
              a.vehicle,
              a.enabledAlterations,
            );
            const isConflicting = alterationIsConflicting(
              addon,
              a.vehicle.alterations.addons,
              a.enabledAlterations,
              selectedLoadout,
            );
            const isDisabled = !isEnabled && isConflicting;
            const cost = addon.cost;

            return (
              <Checkbox.Root
                alignItems="center"
                checked={isEnabled}
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                disabled={isDisabled}
                display="inline-flex"
                gap={1.5}
                justifyContent="center"
                size="sm"
                onCheckedChange={(details) => {
                  const next = { ...a.enabledAlterations };
                  if (details.checked) next[addonName] = true;
                  else delete next[addonName];
                  a.onAlterationsChange(next);
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control borderRadius="none">
                  {isEnabled && <MdOutlineCheck />}
                </Checkbox.Control>
                {cost !== undefined && (
                  <Checkbox.Label
                    color="fg.muted"
                    css={{ fontVariantNumeric: 'tabular-nums' }}
                    fontSize="xs"
                    minWidth="3.5ch"
                    textAlign="right"
                  >
                    {cost}
                  </Checkbox.Label>
                )}
              </Checkbox.Root>
            );
          },
        })),
      });
    }

    for (const s of restSections) sections.push(mapSection(s));

    return sections;
  }, [statSections, allLoadoutNames, allAddonNames]);

  return (
    <ComparisonGrid<AssembledVehicle>
      addColumn={
        <AddColumnHeader
          addLabel="Add"
          emptyMessage="No vehicles found"
          itemHeight={VEHICLE_LIST_ITEM_HEIGHT_PX}
          items={allVehicles}
          matchesQuery={matchesVehicleQuery}
          placeholder="Search..."
          renderItem={(vehicle) => (
            <>
              <VehicleIcon size={18} slug={vehicle.slug} />
              <Text fontSize="sm" overflow="hidden" textOverflow="ellipsis">
                {vehicle.name}
              </Text>
            </>
          )}
          selectedSlugs={selectedSlugs}
          onAdd={onAdd}
        />
      }
      hasAddColumn={hasAddColumn}
      headerCells={vehicles.map((vehicle) => ({
        key: vehicle.info.slug,
        content: (
          <ColumnHeader onRemove={() => onRemove(vehicle.info.slug)}>
            <VehicleIcon size={20} slug={vehicle.info.slug} />
            <Text fontSize="sm" fontWeight="medium" lineHeight="tight" truncate>
              {vehicle.info.name}
            </Text>
          </ColumnHeader>
        ),
      }))}
      itemCount={vehicles.length}
      items={assembled}
      loadingCount={loadingCount}
      maxWidth={maxWidth}
      sections={gridSections}
    />
  );
}
