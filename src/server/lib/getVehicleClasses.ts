import vehicles from '@generated/vehicles';

import type { PlaceId } from '@generated/config';

export function getVehicleClasses(placeId: PlaceId) {
  const { metadata } = vehicles.data[placeId];

  const preferredClasses = [
    'Heavy',
    'Medium',
    'Light',
    'Transport',
    'Aircraft',
  ];
  const filteredClasses = preferredClasses.filter((className) =>
    metadata.classes.includes(className),
  );
  const availableClasses = metadata.classes.filter(
    (className) => !filteredClasses.includes(className),
  );
  filteredClasses.push(...availableClasses);

  return filteredClasses;
}
