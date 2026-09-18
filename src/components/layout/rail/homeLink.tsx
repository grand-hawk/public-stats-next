import NextLink from 'next/link';
import React from 'react';

import MTC from '@/components/icons/mtc';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

const LINK_STYLE: React.CSSProperties = {
  alignItems: 'center',
  borderRadius: 4,
  color: 'var(--color-emphasized)',
  display: 'flex',
  height: 40,
  justifyContent: 'center',
  width: 40,
};

export default function RailHomeLink() {
  const initials = usePlaceInitials();

  return (
    <NextLink
      aria-label="Home"
      href={`/${initials}`}
      style={LINK_STYLE}
      title="Home"
    >
      <MTC height="32px" width="32px" />
    </NextLink>
  );
}
