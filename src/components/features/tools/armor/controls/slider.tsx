import { Input } from '@chakra-ui/react';
import React from 'react';

export interface RangeSliderProps {
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}

export function RangeSlider({
  max,
  min,
  onChange,
  step,
  value,
}: RangeSliderProps) {
  return (
    <Input
      appearance="none"
      background="transparent"
      border="none"
      cursor="pointer"
      width="100%"
      height="20px"
      margin={0}
      max={max}
      min={min}
      step={step}
      type="range"
      value={value}
      css={{
        '&::-webkit-slider-runnable-track': {
          height: '4px',
          background: 'border.muted',
          border: 'none',
          borderRadius: 0,
        },
        '&::-webkit-slider-thumb': {
          WebkitAppearance: 'none',
          height: '14px',
          width: '8px',
          background: 'fg.muted',
          border: '1px solid',
          borderColor: 'border.muted',
          borderRadius: 0,
          marginTop: '-5px',
          cursor: 'grab',
        },
        '&::-webkit-slider-thumb:active': {
          cursor: 'grabbing',
          background: 'fg',
        },
        '&::-moz-range-track': {
          height: '4px',
          background: 'border.muted',
          border: 'none',
          borderRadius: 0,
        },
        '&::-moz-range-thumb': {
          height: '14px',
          width: '8px',
          background: 'fg.muted',
          border: '1px solid',
          borderColor: 'border.muted',
          borderRadius: 0,
          cursor: 'grab',
        },
        '&::-moz-range-thumb:active': {
          cursor: 'grabbing',
          background: 'fg',
        },
      }}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
