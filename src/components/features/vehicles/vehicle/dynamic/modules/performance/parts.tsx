import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import { StatsRoot } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';

export const degreesOfGrade = (percent: number) =>
  (Math.atan(percent / 100) * 180) / Math.PI;

export function Gradient({
  degrees,
  percent,
}: {
  degrees: number;
  percent: number;
}) {
  return (
    <>
      <FormatNumber
        maximumFractionDigits={0}
        style="unit"
        unit="percent"
        value={percent}
      />{' '}
      (
      <FormatNumber
        maximumFractionDigits={0}
        style="unit"
        unit="degree"
        unitDisplay="narrow"
        value={degrees}
      />
      )
    </>
  );
}

export function Seconds({ value }: { value: number }) {
  return (
    <FormatNumber
      maximumFractionDigits={1}
      style="unit"
      unit="second"
      value={value}
    />
  );
}

export function Group({
  children,
  moduleId,
  title,
}: {
  children: React.ReactNode;
  moduleId: string;
  title: string;
}) {
  return (
    <TitledCard
      collapsible
      headingAs="h3"
      moduleId={moduleId}
      title={title}
      withAnchor={`Performance ${title}`}
    >
      <StatsRoot>{children}</StatsRoot>
    </TitledCard>
  );
}
