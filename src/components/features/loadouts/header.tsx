import { Span } from '@chakra-ui/react';
import React from 'react';

import ArticleTitle from '@/components/wiki/articleTitle';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';

interface LoadoutHeaderProps {
  name: string;
  tagline?: string;
}

export default function LoadoutHeader({ name, tagline }: LoadoutHeaderProps) {
  return (
    <ArticleTitle
      id="loadout-page-title"
      meta={tagline ? <Span>{tagline}</Span> : undefined}
      title={loadoutDisplayName(name)}
    />
  );
}
