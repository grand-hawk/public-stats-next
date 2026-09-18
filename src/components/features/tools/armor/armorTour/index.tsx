import { Portal } from '@chakra-ui/react';
import React from 'react';

import { TourPopover } from '@/components/features/tools/armor/armorTour/popover';
import {
  TOOLTIP_WIDTH,
  VIEWPORT_MARGIN,
} from '@/components/features/tools/armor/armorTour/position';
import { TourSpotlight } from '@/components/features/tools/armor/armorTour/spotlight';
import {
  STEPS,
  VEHICLE_STEP,
} from '@/components/features/tools/armor/armorTour/steps';
import { useTourLayout } from '@/components/features/tools/armor/armorTour/useTourLayout';

import type { TourLayout } from '@/components/features/tools/armor/armorTour/useTourLayout';

function popoverStyle(layout: TourLayout | null): React.CSSProperties {
  if (layout?.compact) {
    return {
      position: 'fixed',
      insetInline: VIEWPORT_MARGIN,
      bottom: VIEWPORT_MARGIN,
      maxHeight: '50vh',
      overflowY: 'auto',
      zIndex: 10001,
    };
  }

  return {
    position: 'fixed',
    left: layout?.left ?? VIEWPORT_MARGIN,
    top: layout?.top ?? VIEWPORT_MARGIN,
    width: layout?.width ?? TOOLTIP_WIDTH,
    maxHeight: `calc(100vh - ${VIEWPORT_MARGIN * 2}px)`,
    overflowY: 'auto',
    visibility: layout ? 'visible' : 'hidden',
    zIndex: 10001,
  };
}

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
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const layout = useTourLayout(open, step, tooltipRef);

  React.useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  React.useEffect(() => {
    if (open && step === VEHICLE_STEP && hasVehicle) setStep(VEHICLE_STEP + 1);
  }, [open, step, hasVehicle]);

  if (!open) return null;

  const close = () => onOpenChange(false);

  return (
    <Portal>
      <TourSpotlight rect={layout?.rect ?? null} />

      <TourPopover
        ref={tooltipRef}
        showNext={!(step === VEHICLE_STEP && !hasVehicle)}
        step={step}
        style={popoverStyle(layout)}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onClose={close}
        onNext={() => {
          if (step < STEPS.length - 1) setStep(step + 1);
          else close();
        }}
      />
    </Portal>
  );
}
