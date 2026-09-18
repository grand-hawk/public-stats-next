import { Collapsible, Icon } from '@chakra-ui/react';
import React from 'react';
import { MdExpandLess, MdOutlineExpandMore } from 'react-icons/md';

import { FOCUS_RING_CSS } from '@/components/ui/styles';

export default function CardCollapseTrigger({
  expanded,
}: {
  expanded: boolean;
}) {
  return (
    <Collapsible.Trigger
      aria-label={expanded ? 'Collapse section' : 'Expand section'}
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        height: '32px',
        minWidth: '32px',
        paddingInline: expanded ? 0 : '8px 4px',
        borderRadius: '4px',
        color: expanded ? 'fg.muted' : 'fg',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '20px',
        backgroundColor: expanded ? 'transparent' : 'var(--color-surface-2)',
        '&:hover': { backgroundColor: 'var(--color-surface-3)' },
        '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
      }}
    >
      {!expanded && <span>Show</span>}
      <Icon>{expanded ? <MdExpandLess /> : <MdOutlineExpandMore />}</Icon>
    </Collapsible.Trigger>
  );
}
