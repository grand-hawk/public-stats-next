import { Box } from '@chakra-ui/react';
import React from 'react';

import { ARTICLE_TEXT_GAP } from '@/components/article/prose';

export default function Formula({ children }: { children: React.ReactNode }) {
  return (
    <Box
      role="math"
      css={{
        marginBlock: ARTICLE_TEXT_GAP,
        paddingInlineStart: '24px',
        overflowX: 'auto',
        color: 'fg.emphasized',
        fontSize: '1.0625rem',
        fontStyle: 'italic',
        lineHeight: '1.75rem',
        '& p': { margin: '0 !important' },
        '& sup': { fontSize: '0.7em', fontStyle: 'normal' },
      }}
    >
      {children}
    </Box>
  );
}
