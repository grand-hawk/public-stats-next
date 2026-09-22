import { Span } from '@chakra-ui/react';
import React from 'react';

import PlaceableTurntable from '@/components/features/placeables/placeable/turntable';
import ArticleTitle from '@/components/wiki/articleTitle';
import { usePlaceable } from '@/hooks/providers/placeable';
import {
  buildToolLabel,
  placeableDisplayName,
  placeableKindLabel,
} from '@/utils/placeables';

export default function PlaceableHeader() {
  const placeable = usePlaceable();

  const tools = [
    ...new Set(
      placeable.availability.flatMap((entry) =>
        entry.via === 'buildTool' ? [entry.tool] : [],
      ),
    ),
  ];

  return (
    <ArticleTitle
      aside={<PlaceableTurntable />}
      id="placeable-page-title"
      title={placeableDisplayName(placeable.name)}
      meta={
        <>
          <Span>{placeableKindLabel(placeable.kind)}</Span>
          {tools.map((tool) => (
            <Span key={tool}>{buildToolLabel(tool)}</Span>
          ))}
        </>
      }
    />
  );
}
