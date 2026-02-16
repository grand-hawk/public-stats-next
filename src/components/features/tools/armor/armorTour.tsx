import { Box, Flex, Portal, Text } from '@chakra-ui/react';
import React from 'react';

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface TourStep {
  target: string;
  title: string;
  description: string;
  placement: Placement;
}

const STEPS: TourStep[] = [
  {
    target: 'vehicle',
    title: 'Select a vehicle',
    description: 'Search and select a vehicle to continue.',
    placement: 'right',
  },
  {
    target: 'angle',
    title: 'Change angle',
    description:
      'Switch the viewing angle to see armour from different directions.',
    placement: 'right',
  },
  {
    target: 'depth',
    title: 'Depth filter',
    description: 'Use depth sliders to isolate specific armour layers.',
    placement: 'right',
  },
  {
    target: 'range',
    title: 'Range & palette',
    description:
      'Toggle between automatically chosen range or manually set range, and choose a color palette.',
    placement: 'right',
  },
];

const VEHICLE_STEP = 0;

const PADDING = 6;
const TOOLTIP_GAP = 10;
const TOOLTIP_WIDTH = 240;

interface ArmorTourProps {
  hasVehicle: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArmorTour({
  hasVehicle,
  onOpenChange,
  open,
}: ArmorTourProps) {
  const [step, setStep] = React.useState(0);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  React.useEffect(() => {
    if (open && step === VEHICLE_STEP && hasVehicle) setStep(VEHICLE_STEP + 1);
  }, [open, step, hasVehicle]);

  React.useLayoutEffect(() => {
    if (!open) return;

    const el = document.querySelector(
      `[data-tour="${STEPS[step].target}"]`,
    ) as HTMLElement | null;

    const measure = () => {
      setRect(el ? el.getBoundingClientRect() : null);
    };

    measure();

    if (el) {
      el.style.position = 'relative';
      el.style.zIndex = '10001';
    }

    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    window.addEventListener('scroll', measure, true);

    return () => {
      if (el) {
        el.style.position = '';
        el.style.zIndex = '';
      }
      observer.disconnect();
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, step]);

  if (!open) return null;

  const current = STEPS[step];

  const close = () => onOpenChange(false);
  const isWaitingForVehicle = step === VEHICLE_STEP && !hasVehicle;
  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    width: TOOLTIP_WIDTH,
    zIndex: 10001,
  };

  if (rect) {
    const pad = PADDING;
    const gap = TOOLTIP_GAP;

    switch (current.placement) {
      case 'right':
        tooltipStyle.left = rect.right + pad + gap;
        tooltipStyle.top = rect.top + rect.height / 2;
        tooltipStyle.transform = 'translateY(-50%)';
        break;
      case 'left':
        tooltipStyle.left = rect.left - pad - gap - TOOLTIP_WIDTH;
        tooltipStyle.top = rect.top + rect.height / 2;
        tooltipStyle.transform = 'translateY(-50%)';
        break;
      case 'bottom':
        tooltipStyle.left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
        tooltipStyle.top = rect.bottom + pad + gap;
        break;
      case 'top':
        tooltipStyle.left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
        tooltipStyle.top = rect.top - pad - gap;
        tooltipStyle.transform = 'translateY(-100%)';
        break;
    }

    const left = parseFloat(String(tooltipStyle.left)) || 0;
    tooltipStyle.left = Math.max(
      8,
      Math.min(left, window.innerWidth - TOOLTIP_WIDTH - 8),
    );
  }

  const highlightStyle: React.CSSProperties = rect
    ? {
        position: 'fixed',
        top: rect.top - PADDING,
        left: rect.left - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
        zIndex: 10000,
        pointerEvents: 'none',
      }
    : {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 10000,
        pointerEvents: 'none',
      };

  return (
    <Portal>
      <Box position="fixed" inset="0" zIndex={9999} onClick={close} />

      <Box style={highlightStyle} />

      <Flex
        ref={tooltipRef}
        background="bg.panel"
        borderColor="border.muted"
        borderWidth="1px"
        direction="column"
        gap={2}
        paddingX={3}
        paddingY={2.5}
        style={tooltipStyle}
      >
        <div>
          <Text fontSize="sm" fontWeight="medium">
            {current.title}
          </Text>
          <Text color="fg.muted" fontSize="xs" lineHeight="1.5" marginTop={0.5}>
            {current.description}
          </Text>
        </div>

        <Flex alignItems="center" gap={2} justifyContent="space-between">
          <Text color="fg.subtle" fontSize="2xs">
            {step + 1} / {STEPS.length}
          </Text>

          <Flex gap={1}>
            <Box
              as="button"
              borderColor="border.muted"
              borderWidth="1px"
              color="fg.muted"
              cursor="pointer"
              fontSize="2xs"
              paddingX={2}
              paddingY={0.5}
              _hover={{ color: 'fg', background: 'whiteAlpha.100' }}
              onClick={close}
            >
              Skip
            </Box>
            {step > 0 && (
              <Box
                as="button"
                borderColor="border.muted"
                borderWidth="1px"
                color="fg.muted"
                cursor="pointer"
                fontSize="2xs"
                paddingX={2}
                paddingY={0.5}
                _hover={{ color: 'fg', background: 'whiteAlpha.100' }}
                onClick={back}
              >
                Back
              </Box>
            )}
            {!isWaitingForVehicle && (
              <Box
                as="button"
                borderColor="border.muted"
                borderWidth="1px"
                color="fg.muted"
                cursor="pointer"
                fontSize="2xs"
                paddingX={2}
                paddingY={0.5}
                _hover={{ color: 'fg', background: 'whiteAlpha.100' }}
                onClick={next}
              >
                {step < STEPS.length - 1 ? 'Next' : 'Done'}
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Portal>
  );
}
