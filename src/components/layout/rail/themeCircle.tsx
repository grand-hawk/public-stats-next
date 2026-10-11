import { Box, chakra, VisuallyHidden } from '@chakra-ui/react';
import React from 'react';

import { DURATION_BASE } from '@/components/layout/shell/constants';

const split = (direction: string, from: string, to: string) =>
  `linear-gradient(${direction}, ${from} calc(50% - 0.5px), ${to} calc(50% + 0.5px))`;

const THEME_SPLIT = split(
  'to right',
  'var(--color-progressive)',
  'var(--color-surface-0)',
);

// the tokens are light-dark() pairs, so colorScheme alone picks which theme the swatch shows
const SWATCH: Record<string, React.CSSProperties> = {
  system: {
    background: split(
      'to top right',
      'var(--color-neutral-1000)',
      'var(--color-white)',
    ),
  },
  light: { colorScheme: 'light', background: THEME_SPLIT },
  dark: { colorScheme: 'dark', background: THEME_SPLIT },
};

export default function ThemeCircle({
  checked,
  label,
  name,
  onHover,
  onSelect,
  value,
}: {
  checked: boolean;
  label: string;
  name: string;
  onHover: (value: string | null) => void;
  onSelect: (value: string) => void;
  value: string;
}) {
  return (
    <Box
      as="label"
      onMouseEnter={() => onHover(value)}
      css={{
        position: 'relative',
        display: 'block',
        width: '44px',
        height: '44px',
        borderRadius: 'var(--border-radius-circle)',
        outline: '2px solid transparent',
        outlineOffset: '2px',
        cursor: 'pointer',
        transitionDuration: DURATION_BASE,
        transitionProperty: 'outline-color, border-radius',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: 'inset 0 0 0 1px var(--border-color-interactive)',
          pointerEvents: 'none',
        },
        '&:hover': {
          outlineColor: 'var(--border-color-interactive--hover)',
          borderRadius: 'var(--border-radius-large)',
        },
        '&:active': {
          outlineColor: 'var(--border-color-interactive--active)',
          borderRadius: 'var(--border-radius-large)',
        },
        '&:has(input:checked), &:has(input:focus-visible)': {
          outlineColor: 'var(--color-progressive)',
          borderRadius: 'var(--border-radius-large)',
        },
        '&:has(input:checked), &:has(input:checked) *': { cursor: 'default' },
      }}
    >
      <chakra.input
        checked={checked}
        name={name}
        type="radio"
        value={value}
        onChange={() => onSelect(value)}
        css={{
          position: 'absolute',
          inset: 0,
          margin: 0,
          opacity: 0,
          cursor: 'inherit',
        }}
      />
      <Box
        aria-hidden
        css={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
        style={SWATCH[value]}
      />
      <VisuallyHidden>{label}</VisuallyHidden>
    </Box>
  );
}
