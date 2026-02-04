import { Box, HStack, Tabs } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useQueryState } from 'nuqs';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slug from 'slug';

import LoadoutVehiclesGrid from '@/components/features/teams/loadouts/grid';
import TeamIcon from '@/components/icons/teams';
import { EmptyState } from '@/components/ui/empty-state';
import TitledCard from '@/components/wiki/titledCard';
import { slugifyArray } from '@/utils/slugifyArray';

import type { Loadout } from '@/server/api/trpc/routers/loadouts';

interface LoadoutTeamsProps {
  initials: string;
  loadout: Loadout;
}

export default function LoadoutTeams({ initials, loadout }: LoadoutTeamsProps) {
  const teamNames = React.useMemo(
    () => Object.keys(loadout.teams),
    [loadout.teams],
  );

  const teamSlugs = React.useMemo(() => slugifyArray(teamNames), [teamNames]);

  const [teamQuery, setTeamQuery] = useQueryState('team');

  const selectedTeam =
    teamQuery && teamSlugs[teamQuery] ? teamSlugs[teamQuery] : teamNames[0];

  if (teamNames.length === 0)
    return (
      <TitledCard as="section" title="Teams" withAnchor>
        <EmptyState
          icon={<GrDocumentMissing />}
          title="This loadout has no teams"
        />
      </TitledCard>
    );

  return (
    <TitledCard as="section" innerPadding={0} title="Teams" withAnchor>
      <Box data-md-ignore>
        <Tabs.Root
          lazyMount
          onValueChange={(e) => setTeamQuery(slug(e.value))}
          value={selectedTeam}
        >
          <Box
            _scrollbar={{ height: '2px' }}
            borderBottomWidth="1px"
            overflowX="auto"
            overflowY="hidden"
            paddingX={3}
          >
            <Tabs.List border="0">
              {teamNames.map((team) => (
                <Tabs.Trigger
                  colorPalette="teal"
                  flexShrink={0}
                  key={team}
                  textStyle="sm"
                  value={team}
                >
                  <HStack gap={1.5}>
                    <TeamIcon team={team} />
                    <span>{team}</span>
                  </HStack>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Box>

          {teamNames.map((team) => (
            <Tabs.Content key={team} padding={0} value={team}>
              <LoadoutVehiclesGrid
                initials={initials}
                vehicles={loadout.teams[team]}
              />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>

      <div data-md-show style={{ display: 'none' }}>
        {teamNames.map((teamName) => {
          const vehicles = Object.entries(loadout.teams[teamName]);
          return (
            <React.Fragment key={teamName}>
              <h3>{teamName}</h3>
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
