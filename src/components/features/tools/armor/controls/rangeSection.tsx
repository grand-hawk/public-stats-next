import { Flex, NumberInput, Text } from '@chakra-ui/react';
import React from 'react';

import { ControlSection } from '@/components/features/tools/armor/controls/section';
import { Pill } from '@/components/ui/pillGroup';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const NUMBER_INPUT_CSS: SystemStyleObject = {
  height: '32px',
  paddingInline: '8px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-interactive)',
  borderRadius: '4px',
  backgroundColor: 'var(--color-surface-1)',
  boxShadow: 'inset 0 0 0 1px transparent',
  color: 'var(--color-base)',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  fontVariantNumeric: 'tabular-nums',
  transitionProperty: 'background-color, color, border-color, box-shadow',
  transitionDuration: '250ms',
  transitionTimingFunction: 'var(--transition-timing-function-ease, ease)',
  '&:hover:not(:disabled)': {
    borderColor: 'var(--border-color-interactive--hover)',
  },
  '&:focus, &:focus-visible': {
    ...FOCUS_RING_CSS,
    borderColor: 'var(--border-color-progressive--focus)',
  },
  '&:disabled': { color: 'fg.muted', cursor: 'not-allowed' },
};

const AUTO_PILL_CSS: SystemStyleObject = { marginInlineStart: 'auto' };

const AUTO_PILL_SELECTED_CSS: SystemStyleObject = {
  ...AUTO_PILL_CSS,
  color: 'var(--color-progressive)',
  '&:hover': {
    color: 'var(--color-progressive)',
    backgroundColor: 'quiet.active',
  },
};

interface RangeSectionProps {
  autoRange: boolean;
  detectedMax: number;
  detectedMin: number;
  maxMm: number;
  minMm: number;
  onAutoRangeChange: (v: boolean) => void;
  onMaxChange: (v: number) => void;
  onMinChange: (v: number) => void;
}

export function RangeSection({
  autoRange,
  detectedMax,
  detectedMin,
  maxMm,
  minMm,
  onAutoRangeChange,
  onMaxChange,
  onMinChange,
}: RangeSectionProps) {
  return (
    <ControlSection
      label="Range (mm)"
      tour="range"
      action={
        <Pill
          css={autoRange ? AUTO_PILL_SELECTED_CSS : AUTO_PILL_CSS}
          selected={autoRange}
          size="xs"
          onClick={() => onAutoRangeChange(!autoRange)}
        >
          Auto
        </Pill>
      }
    >
      <Flex alignItems="center" gap="8px">
        <NumberInput.Root
          disabled={autoRange}
          min={0}
          size="sm"
          value={String(autoRange ? detectedMin : minMm)}
          width="100%"
          onValueChange={(d) => onMinChange(Number(d.value))}
        >
          <NumberInput.Input css={NUMBER_INPUT_CSS} width="100%" />
        </NumberInput.Root>
        <Text as="span" color="fg.muted" flexShrink={0} fontSize="0.875rem">
          –
        </Text>
        <NumberInput.Root
          disabled={autoRange}
          min={0}
          size="sm"
          value={String(autoRange ? detectedMax : maxMm)}
          width="100%"
          onValueChange={(d) => onMaxChange(Number(d.value))}
        >
          <NumberInput.Input css={NUMBER_INPUT_CSS} width="100%" />
        </NumberInput.Root>
      </Flex>
    </ControlSection>
  );
}
