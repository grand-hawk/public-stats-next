import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { ControlSection } from '@/components/features/tools/armor/controls/section';
import { RangeSlider } from '@/components/features/tools/armor/controls/slider';

import type { SystemStyleObject } from '@chakra-ui/react';

const VALUE_CSS: SystemStyleObject = {
  marginInlineStart: 'auto',
  color: 'fg.emphasized',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  fontVariantNumeric: 'tabular-nums',
};

const SLIDER_LABEL_CSS: SystemStyleObject = {
  flexShrink: 0,
  width: '28px',
  color: 'fg.muted',
  fontSize: '0.75rem',
  lineHeight: '1.25rem',
};

interface RicochetSectionProps {
  onRicochetAngleChange: (v: number) => void;
  ricochetAngle: number;
}

export function RicochetSection({
  onRicochetAngleChange,
  ricochetAngle,
}: RicochetSectionProps) {
  return (
    <ControlSection
      label="Ricochet angle"
      action={
        <Text as="span" css={VALUE_CSS}>
          {ricochetAngle.toFixed(1)}°
        </Text>
      }
    >
      <RangeSlider
        max={90}
        min={75}
        step={0.5}
        value={ricochetAngle}
        onChange={onRicochetAngleChange}
      />
    </ControlSection>
  );
}

interface DepthSectionProps {
  detectedMaxDepth: number;
  maxDepth: number;
  minDepth: number;
  onMaxDepthChange: (v: number) => void;
  onMinDepthChange: (v: number) => void;
}

export function DepthSection({
  detectedMaxDepth,
  maxDepth,
  minDepth,
  onMaxDepthChange,
  onMinDepthChange,
}: DepthSectionProps) {
  const effectiveMaxDepth = detectedMaxDepth || 100;

  return (
    <ControlSection label="Depth" tour="depth">
      <Flex alignItems="center" gap="8px">
        <Text as="span" css={SLIDER_LABEL_CSS}>
          Min
        </Text>
        <RangeSlider
          max={effectiveMaxDepth}
          min={0}
          step={effectiveMaxDepth / 200}
          value={minDepth}
          onChange={(v: number) => onMinDepthChange(Math.min(v, maxDepth))}
        />
      </Flex>
      <Flex alignItems="center" gap="8px">
        <Text as="span" css={SLIDER_LABEL_CSS}>
          Max
        </Text>
        <RangeSlider
          max={effectiveMaxDepth}
          min={0}
          step={effectiveMaxDepth / 200}
          value={Math.min(maxDepth, effectiveMaxDepth)}
          onChange={(v: number) => onMaxDepthChange(Math.max(v, minDepth))}
        />
      </Flex>
    </ControlSection>
  );
}
