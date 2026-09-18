import { Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import { STEPS } from '@/components/features/tools/armor/armorTour/steps';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const CARD_CSS: SystemStyleObject = {
  padding: '16px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-base)',
  borderRadius: '8px',
  backgroundColor: 'var(--color-surface-1)',
  boxShadow: 'var(--box-shadow-large)',
};

const QUIET_BUTTON_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  height: '32px',
  paddingInline: '10px',
  borderRadius: '4px',
  color: 'fg.muted',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  transition:
    'background-color 100ms var(--transition-timing-function-ease, ease),' +
    ' color 100ms var(--transition-timing-function-ease, ease)',
  '&:hover': { color: 'var(--color-base)', backgroundColor: 'quiet.hover' },
  '&:active': { backgroundColor: 'quiet.active' },
  '&:focus-visible': FOCUS_RING_CSS,
};

const ACTION_BUTTON_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  height: '32px',
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
  '&:hover': { backgroundColor: 'var(--color-surface-3)' },
  '&:active': { backgroundColor: 'var(--color-surface-4)' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
};

interface TourPopoverProps {
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
  showNext: boolean;
  step: number;
  style: React.CSSProperties;
}

export const TourPopover = React.forwardRef<HTMLDivElement, TourPopoverProps>(
  function TourPopover(
    { onBack, onClose, onNext, showNext, step, style },
    ref,
  ) {
    const current = STEPS[step];

    return (
      <Flex
        ref={ref}
        css={CARD_CSS}
        direction="column"
        gap="12px"
        style={style}
      >
        <div>
          <Text
            color="fg.emphasized"
            fontSize="1rem"
            fontWeight={500}
            lineHeight="1.625rem"
          >
            {current.title}
          </Text>
          <Text
            color="fg.muted"
            fontSize="0.875rem"
            lineHeight="1.375rem"
            marginTop="2px"
          >
            {current.description}
          </Text>
        </div>

        <Flex alignItems="center" gap="8px" justifyContent="space-between">
          <Text
            color="fg.muted"
            fontSize="0.75rem"
            fontVariantNumeric="tabular-nums"
            lineHeight="1.25rem"
          >
            {step + 1} / {STEPS.length}
          </Text>

          <Flex gap="4px">
            <chakra.button
              css={QUIET_BUTTON_CSS}
              type="button"
              onClick={onClose}
            >
              Skip
            </chakra.button>
            {step > 0 && (
              <chakra.button
                css={QUIET_BUTTON_CSS}
                type="button"
                onClick={onBack}
              >
                Back
              </chakra.button>
            )}
            {showNext && (
              <chakra.button
                css={ACTION_BUTTON_CSS}
                type="button"
                onClick={onNext}
              >
                {step < STEPS.length - 1 ? 'Next' : 'Done'}
              </chakra.button>
            )}
          </Flex>
        </Flex>
      </Flex>
    );
  },
);
