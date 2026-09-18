import { Span } from '@chakra-ui/react';
import React from 'react';

import TeamIcon from '@/components/icons/teams';
import ArticleTitle from '@/components/wiki/articleTitle';

interface TeamHeaderProps {
  lore: boolean;
  name: string;
}

export default function TeamHeader({ lore, name }: TeamHeaderProps) {
  return (
    <ArticleTitle
      icon={<TeamIcon size="24px" team={name} />}
      id="team-page-title"
      meta={<Span>{lore ? 'Lore team' : 'Playable team'}</Span>}
      title={name}
    />
  );
}
