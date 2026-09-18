import { Input } from '@chakra-ui/react';
import React from 'react';

export interface RangeSliderProps {
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}

const TRACK_CSS = {
  height: '4px',
  border: 'none',
  borderRadius: '9999px',
  background:
    'linear-gradient(to right,' +
    ' var(--color-progressive) 0 var(--armor-slider-fill),' +
    ' var(--color-surface-3) var(--armor-slider-fill) 100%)',
} as const;

const THUMB_CSS = {
  boxSizing: 'border-box',
  height: '14px',
  width: '14px',
  background: 'var(--color-emphasized)',
  border: '1px solid var(--border-color-base)',
  borderRadius: '9999px',
  boxShadow: '0 0 0 0 transparent',
  cursor: 'grab',
  transition:
    'box-shadow 100ms var(--transition-timing-function-ease, ease),' +
    ' background-color 100ms var(--transition-timing-function-ease, ease)',
} as const;

const THUMB_RING = {
  boxShadow:
    '0 0 0 4px color-mix(in oklch, var(--color-progressive) 25%, transparent)',
} as const;

export function RangeSlider({
  max,
  min,
  onChange,
  step,
  value,
}: RangeSliderProps) {
  const span = max - min;
  const ratio = span > 0 ? (value - min) / span : 0;
  const fill = `${Math.min(100, Math.max(0, ratio * 100))}%`;

  return (
    <Input
      appearance="none"
      background="transparent"
      border="none"
      cursor="pointer"
      width="100%"
      height="24px"
      margin={0}
      max={max}
      min={min}
      step={step}
      type="range"
      value={value}
      style={{ '--armor-slider-fill': fill } as React.CSSProperties}
      css={{
        padding: 0,
        '&:focus': { outline: 'none', boxShadow: 'none' },
        '&::-webkit-slider-runnable-track': TRACK_CSS,
        '&::-moz-range-track': TRACK_CSS,
        '&::-webkit-slider-thumb': {
          WebkitAppearance: 'none',
          marginTop: '-5px',
          ...THUMB_CSS,
        },
        '&::-moz-range-thumb': THUMB_CSS,
        '&:hover::-webkit-slider-thumb': THUMB_RING,
        '&:hover::-moz-range-thumb': THUMB_RING,
        '&:focus-visible::-webkit-slider-thumb': THUMB_RING,
        '&:focus-visible::-moz-range-thumb': THUMB_RING,
        '&:active::-webkit-slider-thumb': { ...THUMB_RING, cursor: 'grabbing' },
        '&:active::-moz-range-thumb': { ...THUMB_RING, cursor: 'grabbing' },
      }}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
