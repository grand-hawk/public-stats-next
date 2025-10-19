import { Group, IconButton, Input, Presence } from '@chakra-ui/react';
import React from 'react';
import { MdExpandLess } from 'react-icons/md';
import { MdOutlineExpandMore } from 'react-icons/md';

import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useVehicleSearchStore } from '@/stores/vehicles/search';
import { useVehicleSidebarStore } from '@/stores/vehicles/sidebar';

export const VEHICLE_SEARCH_INPUT_HEIGHT = '48px';

export default function VehicleSearchInput({
  noButton,
}: {
  noButton?: boolean;
}) {
  const vehicleQuery = useRouterQuery('vehicle');
  const query = useVehicleSearchStore((s) => s.query);
  const setQuery = useVehicleSearchStore((s) => s.setQuery);
  const isOpen = useVehicleSidebarStore((s) => s.open);
  const setOpen = useVehicleSidebarStore((s) => s.setOpen);

  // Close the sidebar when a different vehicle was selected
  React.useEffect(() => {
    if (isOpen) setOpen(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleQuery]);

  return (
    <Group gap={0} height={VEHICLE_SEARCH_INPUT_HEIGHT} width="100%">
      <Input
        borderRadius="none"
        height="100%"
        placeholder="Search..."
        value={query}
        variant="subtle"
        onChange={(e) => setQuery(e.target.value)}
        onSelect={() => {
          if (!isOpen) setOpen(true);
        }}
      />

      <Presence present={!noButton}>
        <IconButton
          aria-label={isOpen ? 'Collapse search' : 'Expand search'}
          borderRadius="none"
          height={VEHICLE_SEARCH_INPUT_HEIGHT}
          hideFrom="md"
          variant="subtle"
          width={VEHICLE_SEARCH_INPUT_HEIGHT}
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? <MdOutlineExpandMore /> : <MdExpandLess />}
        </IconButton>
      </Presence>
    </Group>
  );
}
