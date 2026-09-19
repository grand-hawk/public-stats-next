import { HStack, Span } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/common/infoTooltip';
import { InfantryWeaponImage } from '@/components/features/infantryWeapons/weapon/about';
import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';
import ArticleTitle from '@/components/wiki/articleTitle';
import StatArticleLink from '@/components/wiki/statArticleLink';
import { useInfantryWeapon } from '@/hooks/providers/infantryWeapon';
import { INFANTRY_WEAPON_CATEGORIES } from '@/utils/infantryWeapons';

export default function InfantryWeaponHeader() {
  const weapon = useInfantryWeapon();
  const projectile = weapon.projectiles[0];

  const category = INFANTRY_WEAPON_CATEGORIES.find(
    (entry) => entry.key === weapon.category,
  );
  const shellIcon = getShellIcon(weapon.icon);
  const usesDefault = weapon.projectiles.some((entry) => entry.default);
  const tandem = weapon.projectiles.some((entry) =>
    entry.type.toUpperCase().includes('TANDEM'),
  );

  return (
    <ArticleTitle
      aside={<InfantryWeaponImage />}
      id="infantry-weapon-page-title"
      title={weapon.name}
      meta={
        <>
          {category && <Span>{category.label}</Span>}

          {projectile && (
            <HStack gap={1.5}>
              {tandem ? (
                <StatArticleLink article="tandem">
                  {projectile.type}
                </StatArticleLink>
              ) : (
                <Span>{projectile.type}</Span>
              )}
              {shellIcon && <ShellIcon alt="" size={20} src={shellIcon} />}
            </HStack>
          )}

          {usesDefault && (
            <HStack gap={1}>
              <Span>Generic bullet</Span>
              <InfoTooltip content="This weapon has no bullet of its own in the game files. It fires the generic bullet, which the projectile figures below describe." />
            </HStack>
          )}
        </>
      }
    />
  );
}
