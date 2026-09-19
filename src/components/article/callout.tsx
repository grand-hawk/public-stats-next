import { Box } from '@chakra-ui/react';
import React from 'react';

import { ARTICLE_TEXT_GAP } from '@/components/article/prose';

type CalloutType = 'note' | 'tip' | 'warning';

const LABELS: Record<CalloutType, string> = {
  note: 'Note',
  tip: 'Tip',
  warning: 'Warning',
};

export default function Callout({
  children,
  title,
  type = 'note',
}: {
  children: React.ReactNode;
  title?: string;
  type?: CalloutType;
}) {
  const label = (title ?? LABELS[type]).replace(/[.:]$/, '');

  return (
    <Box
      role="note"
      css={{
        marginBlock: ARTICLE_TEXT_GAP,
        paddingInlineStart: '12px',
        borderInlineStartWidth: '2px',
        borderInlineStartStyle: 'solid',
        borderColor:
          type === 'warning'
            ? 'var(--color-warning)'
            : 'var(--border-color-base)',
        fontSize: '0.9375rem',
        lineHeight: '1.5rem',
        '& p, & ul, & ol': { marginBlock: '8px' },
        '& > p:first-of-type': { display: 'inline' },
        '& > :last-child': { marginBlockEnd: 0 },
      }}
    >
      <Box as="strong" color="fg.emphasized" fontWeight={600}>
        {label}.
      </Box>{' '}
      {children}
    </Box>
  );
}
