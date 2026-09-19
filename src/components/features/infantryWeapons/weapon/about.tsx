import { Box } from '@chakra-ui/react';
import React from 'react';

import Figure from '@/components/article/figure';
import ArticleProse from '@/components/wiki/articleProse';
import { MEDIA_PREFIX } from '@/env';
import { useInfantryWeapon } from '@/hooks/providers/infantryWeapon';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { applyWikilinks } from '@/utils/wikilinks';

export function InfantryWeaponImage() {
  const weapon = useInfantryWeapon();

  if (!weapon.image) return null;

  return (
    <Figure
      alt={weapon.image.alt}
      caption={weapon.image.caption}
      src={{
        height: weapon.image.height,
        src: `${MEDIA_PREFIX}${weapon.image.path}`,
        width: weapon.image.width,
      }}
    />
  );
}

export default function InfantryWeaponDescription() {
  const weapon = useInfantryWeapon();
  const initials = usePlaceInitials()!;

  if (!weapon.description) return null;

  return (
    <Box marginBlockStart="24px">
      <ArticleProse>
        {applyWikilinks(weapon.description, initials)}
      </ArticleProse>
    </Box>
  );
}
