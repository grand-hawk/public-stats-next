import { Box, Tabs } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useQueryState } from 'nuqs';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slug from 'slug';

import LoadoutVehiclesGrid from '@/components/teams/loadouts/grid';
import { EmptyState } from '@/components/ui/empty-state';
import TitledCard from '@/components/wiki/titledCard';
import { slugifyArray } from '@/utils/slugifyArray';

import type { Team } from '@/server/api/trpc/routers/teams';

interface TeamLoadoutsProps {
  initials: string;
  team: Team;
}

export default function TeamLoadouts({ initials, team }: TeamLoadoutsProps) {
  const loadoutNames = React.useMemo(
    () => Object.keys(team.loadouts),
    [team.loadouts],
  );

  const loadoutSlugs = React.useMemo(
    () => slugifyArray(loadoutNames),
    [loadoutNames],
  );

  const [loadoutQuery, setLoadoutQuery] = useQueryState('loadout');

  const selectedLoadout =
    loadoutQuery && loadoutSlugs[loadoutQuery]
      ? loadoutSlugs[loadoutQuery]
      : loadoutNames[0];

  if (loadoutNames.length === 0) {
    return (
      <TitledCard as="section" title="Loadouts" withAnchor>
        <EmptyState
          icon={<GrDocumentMissing />}
          title="This team has no loadouts"
        />
      </TitledCard>
    );
  }

  return (
    <TitledCard
      as="section"
      innerPadding={0}
      title="Vehicle selection"
      withAnchor
    >
      <Box data-md-ignore>
        <Tabs.Root
          lazyMount
          onValueChange={(e) => setLoadoutQuery(slug(e.value))}
          value={selectedLoadout}
        >
          <Box
            _scrollbar={{ height: '2px' }}
            borderBottomWidth="1px"
            overflowX="auto"
            overflowY="hidden"
            paddingX={3}
          >
            <Tabs.List border="0">
              {loadoutNames.map((loadout) => (
                <Tabs.Trigger
                  colorPalette="teal"
                  flexShrink={0}
                  key={loadout}
                  textStyle="sm"
                  value={loadout}
                >
                  {loadout}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Box>

          {loadoutNames.map((loadout) => (
            <Tabs.Content key={loadout} padding={0} value={loadout}>
              <LoadoutVehiclesGrid
                initials={initials}
                vehicles={team.loadouts[loadout]}
              />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>

      <div data-md-show style={{ display: 'none' }}>
        {loadoutNames.map((loadoutName) => {
          const vehicles = Object.entries(team.loadouts[loadoutName]);
          return (
            <React.Fragment key={loadoutName}>
              <h3>{loadoutName}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Role</th>
                    <th>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(([name, vehicle]) => (
                    <tr key={name}>
                      <td>
                        <NextLink
                          href={`/${initials}/vehicles/${vehicle.slug}`}
                        >
                          {name}
                        </NextLink>
                      </td>
                      <td>{vehicle.role}</td>
                      <td>{vehicle.tier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </React.Fragment>
          );
        })}
      </div>
    </TitledCard>
  );
}
