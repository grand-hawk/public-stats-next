import { Box, Flex, Link, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuCircleHelp, LuDownload } from 'react-icons/lu';

import { ICON_BUTTON_CSS } from '@/components/features/tools/armor/controls/styles';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const ACTION_BUTTON_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  flex: 1,
  height: '36px',
  paddingInline: '12px',
  borderWidth: 0,
  borderRadius: '4px',
  backgroundColor: 'var(--color-surface-2)',
  color: 'var(--color-emphasized)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  transition:
    'background-color 100ms var(--transition-timing-function-ease, ease)',
  '& svg': { width: '16px', height: '16px', flex: 'none' },
  '&:hover': { backgroundColor: 'var(--color-surface-3)' },
  '&:active': { backgroundColor: 'var(--color-surface-4)' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
};

interface ControlsFooterProps {
  onOpenTour: () => void;
  onSave: () => void;
}

export function ControlsFooter({ onOpenTour, onSave }: ControlsFooterProps) {
  return (
    <>
      <Flex gap="8px" paddingBlock="12px">
        <chakra.button css={ACTION_BUTTON_CSS} type="button" onClick={onSave}>
          <LuDownload aria-hidden />
          <Box as="span">Save image</Box>
        </chakra.button>
        <chakra.button
          aria-label="Show the guided tour"
          css={ICON_BUTTON_CSS}
          type="button"
          onClick={onOpenTour}
        >
          <LuCircleHelp aria-hidden />
        </chakra.button>
      </Flex>

      <Box
        marginTop="auto"
        paddingBlock="12px"
        css={{ borderTop: '1px solid var(--border-color-subtle)' }}
      >
        <Text color="fg.subtle" fontSize="0.6875rem" lineHeight="16px">
          The provided visualization may not be used for bug reports, use the
          armour tools in-game instead. Data is estimated and may not be
          accurate. If thickness differs significantly from in-game, you may
          report this as a wiki bug in the{' '}
          <Link
            color="inherit"
            css={{
              textDecoration: 'underline',
              textUnderlineOffset: '0.2em',
              '&:hover': { color: 'var(--color-subtle)' },
            }}
            href="https://discord.gg/multicrew"
            rel="nofollow noopener"
            target="_blank"
          >
            Discord
          </Link>
          .
        </Text>
      </Box>
    </>
  );
}
