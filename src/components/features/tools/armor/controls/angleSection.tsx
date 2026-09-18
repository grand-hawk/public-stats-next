import React from 'react';

import { ANGLES } from '@/components/features/tools/armor/controls/angles';
import { ControlSection } from '@/components/features/tools/armor/controls/section';
import { Pill, PillGroup } from '@/components/ui/pillGroup';

import type { ArmorAngle } from '@/utils/getVehicleImage';

interface AngleSectionProps {
  angle: ArmorAngle;
  onAngleChange: (angle: ArmorAngle) => void;
}

export function AngleSection({ angle, onAngleChange }: AngleSectionProps) {
  return (
    <ControlSection label="Angle" tour="angle">
      <PillGroup columns={3} label="Viewing angle">
        {ANGLES.map((a) => (
          <Pill
            key={a.value}
            selected={angle === a.value}
            size="lg"
            onClick={() => onAngleChange(a.value)}
          >
            {a.label}
          </Pill>
        ))}
      </PillGroup>
    </ControlSection>
  );
}
