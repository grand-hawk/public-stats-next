import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { MdOutlineOpenInFull } from 'react-icons/md';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const GLYPH_CLASS = 'image-expand-glyph';

export const IMAGE_EXPAND_REVEAL_CSS: SystemStyleObject = {
  [`&:hover .${GLYPH_CLASS}, &:focus-visible .${GLYPH_CLASS}, &:focus-within .${GLYPH_CLASS}`]:
    { opacity: 1 },
};

const GLYPH_CSS: SystemStyleObject = {
  position: 'absolute',
  insetBlockStart: '8px',
  insetInlineEnd: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderWidth: 0,
  borderRadius: '4px',
  backgroundColor: 'rgba(11, 11, 11, 0.55)',
  color: '#f7f7f7',
  opacity: 0,
  transition: `opacity ${DURATION_BASE} ${EASE}`,
  '& svg': { width: '16px', height: '16px' },
};

const GLYPH_LINK_CSS: SystemStyleObject = {
  ...GLYPH_CSS,
  '&:hover': { backgroundColor: 'rgba(11, 11, 11, 0.8)' },
  '@media (hover: none)': { opacity: 1 },
  '&:focus-visible': { ...FOCUS_RING_CSS, opacity: 1, outline: 'none' },
};

export default function ImageExpandGlyph({ href }: { href?: string }) {
  if (!href) {
    return (
      <Box aria-hidden className={GLYPH_CLASS} css={GLYPH_CSS}>
        <MdOutlineOpenInFull />
      </Box>
    );
  }

  return (
    <Box asChild className={GLYPH_CLASS} css={GLYPH_LINK_CSS}>
      <NextLink
        aria-label="Open full image"
        href={href}
        prefetch={false}
        rel="nofollow"
        target="_blank"
        title="Open full image"
      >
        <MdOutlineOpenInFull />
      </NextLink>
    </Box>
  );
}
