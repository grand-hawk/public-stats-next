import { Box } from '@chakra-ui/react';
import React from 'react';

import ArticleProse from '@/components/wiki/articleProse';
import { usePlaceable } from '@/hooks/providers/placeable';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { applyWikilinks } from '@/utils/wikilinks';

export default function PlaceableDescription() {
  const placeable = usePlaceable();
  const initials = usePlaceInitials()!;

  if (!placeable.description) return null;

  return (
    <Box marginBlockStart="24px">
      <ArticleProse>
        {applyWikilinks(placeable.description, initials)}
      </ArticleProse>
    </Box>
  );
}
