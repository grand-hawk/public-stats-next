import React from 'react';

import InfoTooltip from '@/components/common/infoTooltip';
import Stat from '@/components/wiki/stat';

export default function TipStat({
  children,
  label,
  tip,
}: {
  children: React.ReactNode;
  label: string;
  tip: string;
}) {
  return (
    <Stat
      label={
        <>
          {label}
          <InfoTooltip content={tip} />
        </>
      }
    >
      {children}
    </Stat>
  );
}
