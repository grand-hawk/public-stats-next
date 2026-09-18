import { Box, Tabs } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useQueryState } from 'nuqs';
import React from 'react';
import slug from 'slug';

import LoadoutVehiclesGrid from '@/components/features/teams/loadouts/grid';
import { WikiTabTrigger, WikiTabsList } from '@/components/wiki/tabs';
import { slugifyArray } from '@/utils/slugifyArray';

import type { GridVehicle } from '@/components/features/teams/loadouts/organizeVehicles';

export default function VehicleTierTabs({
  groups,
  initials,
  queryKey,
  renderHeading,
  renderLabel,
}: {
  groups: Record<string, Record<string, GridVehicle>>;
  initials: string;
  queryKey: string;
  renderHeading: (name: string) => string;
  renderLabel: (name: string) => React.ReactNode;
}) {
  const names = React.useMemo(() => Object.keys(groups), [groups]);
  const nameSlugs = React.useMemo(() => slugifyArray(names), [names]);

  const [selectedSlug, setSelectedSlug] = useQueryState(queryKey);

  const selected =
    selectedSlug && nameSlugs[selectedSlug]
      ? nameSlugs[selectedSlug]
      : names[0];

  return (
    <>
      <Box data-md-ignore>
        <Tabs.Root
          lazyMount
          variant="plain"
          onValueChange={(e) => setSelectedSlug(slug(e.value))}
          value={selected}
        >
          <WikiTabsList>
            {names.map((name) => (
              <WikiTabTrigger key={name} value={name}>
                {renderLabel(name)}
              </WikiTabTrigger>
            ))}
          </WikiTabsList>

          {names.map((name) => (
            <Tabs.Content
              key={name}
              padding={0}
              paddingBlockStart="16px"
              value={name}
            >
              <LoadoutVehiclesGrid
                initials={initials}
                vehicles={groups[name]}
              />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>

      <div data-md-show style={{ display: 'none' }}>
        {names.map((name) => (
          <React.Fragment key={name}>
            <h3>{renderHeading(name)}</h3>
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Role</th>
                  <th>Tier</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groups[name]).map(([vehicleName, vehicle]) => (
                  <tr key={vehicleName}>
                    <td>
                      <NextLink
                        href={`/${initials}/vehicles/${vehicle.slug}`}
                        prefetch={false}
                      >
                        {vehicleName}
                      </NextLink>
                    </td>
                    <td>{vehicle.role}</td>
                    <td>{vehicle.tier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
