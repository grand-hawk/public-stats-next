import { Box, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import { ArticleTable } from '@/components/article/elements';
import { ARTICLE_MDX_CSS } from '@/components/article/prose';
import ShellInlineLink from '@/components/article/shellInlineLink';
import StatArticleLink from '@/components/wiki/statArticleLink';
import TitledCard from '@/components/wiki/titledCard';
import { usePlace } from '@/hooks/usePlace';
import {
  INFANTRY_WEAPONS_PATH,
  INFANTRY_WEAPON_CATEGORIES,
} from '@/utils/infantryWeapons';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';
import { trpc } from '@/utils/trpc';

import type { ListedInfantryWeapon } from '@/server/api/trpc/routers/infantryWeapons';

function byPenetration(a: ListedInfantryWeapon, b: ListedInfantryWeapon) {
  return (
    (a.maxPenetration ?? 0) - (b.maxPenetration ?? 0) ||
    a.name.localeCompare(b.name, undefined, { numeric: true })
  );
}

export default function InfantryWeaponsBrowse() {
  const place = usePlace()!;
  const [weapons] = trpc.infantryWeapons.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  return (
    <>
      {INFANTRY_WEAPON_CATEGORIES.map((category) => {
        const rows = weapons
          .filter((weapon) => weapon.category === category.key)
          .sort(byPenetration);

        if (rows.length === 0) return null;

        return (
          <TitledCard
            key={category.key}
            as="section"
            title={category.label}
            withAnchor
          >
            <Text
              color="fg.muted"
              css={{
                fontSize: '0.875rem',
                lineHeight: '1.375rem',
                marginBlockEnd: '12px',
              }}
            >
              {category.description}
            </Text>

            <Box css={ARTICLE_MDX_CSS}>
              <ArticleTable>
                <thead>
                  <tr>
                    <th>Weapon</th>
                    <th>Type</th>
                    <th>
                      <StatArticleLink article="maxPenetration">
                        Penetration
                      </StatArticleLink>
                    </th>
                    <th>Player damage</th>
                    <th>Rate of fire</th>
                    <th>Magazine</th>
                    <th>Loadouts</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((weapon) => (
                    <tr key={weapon.slug}>
                      <td>
                        <ShellInlineLink
                          basePath={INFANTRY_WEAPONS_PATH}
                          displayType={weapon.displayType ?? ''}
                          slug={weapon.slug}
                        >
                          {weapon.name}
                        </ShellInlineLink>
                      </td>
                      <td>{weapon.type ?? 'None'}</td>
                      <td>
                        {weapon.maxPenetration === undefined
                          ? 'None'
                          : `${weapon.maxPenetration} mm`}
                      </td>
                      <td>
                        {weapon.humanoidDamage === undefined
                          ? 'None'
                          : `${weapon.humanoidDamage} HP`}
                      </td>
                      <td>{weapon.rateOfFire}</td>
                      <td>{weapon.magazineSize ?? 'None'}</td>
                      <td>
                        {weapon.loadouts.map((loadout, index) => (
                          <React.Fragment key={loadout}>
                            {index > 0 && ', '}
                            <NextLink
                              href={`/${place.initials}/loadouts/${slug(loadout)}`}
                              prefetch={false}
                            >
                              {loadoutDisplayName(loadout)}
                            </NextLink>
                          </React.Fragment>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ArticleTable>
            </Box>
          </TitledCard>
        );
      })}
    </>
  );
}
