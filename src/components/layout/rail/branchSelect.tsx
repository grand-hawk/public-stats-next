import React from 'react';

import PreferenceField from '@/components/layout/rail/preferenceField';
import { usePlaceSwitch } from '@/components/layout/rail/usePlaceSwitch';
import { Pill, PillGroup } from '@/components/ui/pillGroup';

export default function BranchSelect() {
  const { current, places, setPlace } = usePlaceSwitch();

  return (
    <PreferenceField label="Branch">
      <PillGroup columns={places.length} label="Branch">
        {places.map((place, i) => (
          <Pill
            key={place.initials}
            selected={place === current}
            size="md"
            onClick={() => setPlace(place)}
          >
            {i === 0 ? place.initials.toUpperCase() : place.placeName}
          </Pill>
        ))}
      </PillGroup>
    </PreferenceField>
  );
}
