import { Box, Span, chakra } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { LuX } from 'react-icons/lu';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import {
  FOCUS_RING_CSS,
  QUIET_HOVER_CSS,
  QUIET_INTERACTIVE_CSS,
  TRUNCATE_CSS,
} from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const CARD_CSS: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minWidth: 0,
};

const MEDIA_CSS: SystemStyleObject = {
  position: 'relative',
  aspectRatio: '2 / 1',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface-3)',
};

const TOP_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '4px',
  minWidth: 0,
};

const NAME_CSS: SystemStyleObject = {
  ...TRUNCATE_CSS,
  display: 'block',
  minWidth: 0,
  color: 'var(--color-progressive)',
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '1.375rem',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
};

const SUBTITLE_CSS: SystemStyleObject = {
  ...TRUNCATE_CSS,
  display: 'block',
  fontSize: '0.75rem',
  lineHeight: '1rem',
};

const REMOVE_CSS: SystemStyleObject = {
  flex: 'none',
  display: 'grid',
  placeItems: 'center',
  width: '24px',
  height: '24px',
  marginInlineStart: 'auto',
  borderRadius: '4px',
  color: 'fg.muted',
  cursor: 'pointer',
  transitionProperty: 'background-color, color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  ...QUIET_INTERACTIVE_CSS,
  '& svg': { width: '14px', height: '14px' },
  '&:hover': { ...QUIET_HOVER_CSS, color: 'fg' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
};

interface ColumnHeaderProps {
  children?: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  media?: React.ReactNode;
  name: string;
  removeLabel: string;
  subtitle?: React.ReactNode;
  onRemove: () => void;
}

export default function ColumnHeader({
  children,
  href,
  icon,
  media,
  name,
  onRemove,
  removeLabel,
  subtitle,
}: ColumnHeaderProps) {
  return (
    <Box css={CARD_CSS}>
      {media && <Box css={MEDIA_CSS}>{media}</Box>}

      <Box css={TOP_CSS}>
        {icon && (
          <Box css={{ flex: 'none', display: 'grid', placeItems: 'center' }}>
            {icon}
          </Box>
        )}

        <Box css={{ minWidth: 0, flex: 1 }}>
          <Box asChild css={NAME_CSS}>
            <NextLink href={href} prefetch={false} title={name}>
              {name}
            </NextLink>
          </Box>

          {subtitle && (
            <Span color="fg.muted" css={SUBTITLE_CSS}>
              {subtitle}
            </Span>
          )}
        </Box>

        <chakra.button
          aria-label={removeLabel}
          css={REMOVE_CSS}
          title={removeLabel}
          type="button"
          onClick={onRemove}
        >
          <LuX aria-hidden />
        </chakra.button>
      </Box>

      {children}
    </Box>
  );
}
