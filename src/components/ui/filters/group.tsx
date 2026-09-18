import { Box, Icon, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuChevronDown } from 'react-icons/lu';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { CLEAR_BUTTON_CSS } from '@/components/ui/filters/styles';
import { FOCUS_RING_CSS, QUIET_INTERACTIVE_CSS } from '@/components/ui/styles';

export interface FilterGroupProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  hasActive: boolean;
  onClear: () => void;
  title: string;
}

const HEADING_CSS = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  paddingInlineEnd: '8px',
  color: 'fg.muted',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  letterSpacing: 'normal',
  textTransform: 'none',
} as const;

const TOGGLE_CSS = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexGrow: 1,
  minWidth: 0,
  minHeight: '32px',
  padding: '8px',
  borderRadius: '4px',
  color: 'inherit',
  cursor: 'pointer',
  fontWeight: 500,
  textAlign: 'start',
  ...QUIET_INTERACTIVE_CSS,
  '&:focus': { outline: 'none', boxShadow: 'none' },
  '&:focus-visible': FOCUS_RING_CSS,
} as const;

const CLEAR_CSS = {
  ...CLEAR_BUTTON_CSS,
  minHeight: '24px',
} as const;

const LIST_CSS = {
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
} as const;

export default function FilterGroup({
  children,
  defaultOpen = true,
  hasActive,
  onClear,
  title,
}: FilterGroupProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Box aria-label={title} as="nav">
      <Box css={HEADING_CSS}>
        <chakra.button
          aria-expanded={open}
          css={TOGGLE_CSS}
          type="button"
          onClick={() => setOpen((previous) => !previous)}
        >
          <Icon
            aria-hidden
            as={LuChevronDown}
            boxSize="16px"
            css={{
              flex: 'none',
              transform: open ? 'none' : 'rotate(-90deg)',
              transitionProperty: 'transform',
              transitionDuration: DURATION_BASE,
              transitionTimingFunction: EASE,
            }}
          />
          <Text as="span">{title}</Text>
        </chakra.button>
        {hasActive && (
          <chakra.button css={CLEAR_CSS} type="button" onClick={onClear}>
            Clear
          </chakra.button>
        )}
      </Box>
      {open && (
        <Box as="ul" css={LIST_CSS}>
          {children}
        </Box>
      )}
    </Box>
  );
}
