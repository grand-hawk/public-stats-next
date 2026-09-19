import React from 'react';

import InfoTooltip from '@/components/common/infoTooltip';
import Stat from '@/components/wiki/stat';
import StatArticleLink from '@/components/wiki/statArticleLink';

import type { StatArticleKey } from '@/content/statLinks';

export default function TipStat({
  article,
  children,
  label,
  tip,
}: {
  article?: StatArticleKey;
  children: React.ReactNode;
  label: string;
  tip: string;
}) {
  return (
    <Stat
      label={
        <>
          {article ? (
            <StatArticleLink article={article}>{label}</StatArticleLink>
          ) : (
            label
          )}
          <InfoTooltip content={tip} />
        </>
      }
    >
      {children}
    </Stat>
  );
}
