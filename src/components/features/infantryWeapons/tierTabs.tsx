import { Box, Tabs } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useQueryState } from 'nuqs';
import React from 'react';
import slug from 'slug';

import WeaponTierGrid from '@/components/features/infantryWeapons/tierGrid';
import { WikiTabTrigger, WikiTabsList } from '@/components/wiki/tabs';
import { useAnchoredTabs } from '@/hooks/useAnchoredTabs';
import { INFANTRY_WEAPONS_PATH, slotLabel } from '@/utils/infantryWeapons';
import { slugifyArray } from '@/utils/slugifyArray';

import type { TeamWeapon } from '@/server/api/trpc/routers/infantryWeapons';

export default function WeaponTierTabs({
  groups,
  initials,
  queryKey,
  renderHeading,
  renderLabel,
}: {
  groups: Record<string, TeamWeapon[]>;
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

  const { mark, ref } = useAnchoredTabs<HTMLDivElement>(selected);

  return (
    <>
      <Box ref={ref} data-md-ignore>
        <Tabs.Root
          lazyMount
          variant="plain"
          onValueChange={(event) => {
            mark();
            setSelectedSlug(slug(event.value));
          }}
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
              <WeaponTierGrid weapons={groups[name]} />
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
                  <th>Weapon</th>
                  <th>Class</th>
                  <th>Slot</th>
                  <th>Tier</th>
                </tr>
              </thead>
              <tbody>
                {groups[name].map((weapon) => (
                  <tr key={`${weapon.slug}-${weapon.class}-${weapon.slot}`}>
                    <td>
                      <NextLink
                        href={`/${initials}${INFANTRY_WEAPONS_PATH}/${weapon.slug}`}
                        prefetch={false}
                      >
                        {weapon.name}
                      </NextLink>
                    </td>
                    <td>{weapon.class}</td>
                    <td>{slotLabel(weapon.slot)}</td>
                    <td>{weapon.tier}</td>
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
