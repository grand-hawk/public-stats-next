import { Box } from '@chakra-ui/react';
import React from 'react';
import { LuImagePlus } from 'react-icons/lu';

import { ARTICLE_BLOCK_GAP } from '@/components/article/prose';
import { IS_DEV } from '@/env';

export default function ImageNeeded({ description }: { description: string }) {
  if (!IS_DEV) return null;

  return (
    <Box
      data-md-ignore
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBlock: ARTICLE_BLOCK_GAP,
        maxWidth: '720px',
        padding: '16px',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: 'var(--border-color-interactive)',
        borderRadius: '8px',
        color: 'fg.muted',
        fontSize: '0.875rem',
        lineHeight: '1.375rem',
      }}
    >
      <LuImagePlus aria-hidden size={20} style={{ flex: 'none' }} />
      <span>Image needed: {description}</span>
    </Box>
  );
}
