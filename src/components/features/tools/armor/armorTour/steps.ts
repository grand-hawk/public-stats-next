export type Placement = 'top' | 'bottom' | 'left' | 'right';

interface TourStep {
  description: string;
  placement: Placement;
  target: string;
  title: string;
}

export const VEHICLE_STEP = 0;

export const STEPS: TourStep[] = [
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
