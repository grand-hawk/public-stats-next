import vehicles from '@generated/vehicles';

import type { PlaceId } from '@generated/config';

export function getPreferredVehicleClasses(placeId: PlaceId) {
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
  if (filteredClasses.length < preferredClasses.length) {
    const availableClasses = metadata.classes.filter(
      (className) => !filteredClasses.includes(className),
    );
    filteredClasses.push(
      ...availableClasses.slice(
        0,
        preferredClasses.length - filteredClasses.length,
      ),
    );
  }

  return filteredClasses;
}
