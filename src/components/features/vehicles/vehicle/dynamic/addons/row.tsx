import { Checkbox, FormatNumber, HStack, Span, Stack } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineCheck } from 'react-icons/md';

import InfoTooltip from '@/components/common/infoTooltip';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

type Addon = DetailedVehicle['alterations']['addons'][string];

export function addonCost(addon: Addon) {
  if (addon.cost === undefined) return 'Free';

  return (
    <>
      <FormatNumber value={addon.cost} /> points
    </>
  );
}

export default function AddonRow({
  addon,
  hasChanges,
  isDisabled,
  isEnabled,
  name,
  onToggle,
}: {
  addon: Addon;
  hasChanges: boolean;
  isDisabled: boolean;
  isEnabled: boolean;
  name: string;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <Stack gap={1.5}>
      {hasChanges ? (
        <Checkbox.Root
          checked={isEnabled}
          disabled={isDisabled}
          onCheckedChange={(details) => onToggle(!!details.checked)}
        >
          <Checkbox.HiddenInput />

          <Checkbox.Control borderRadius="4px">
            {isEnabled && <MdOutlineCheck />}
          </Checkbox.Control>

          <Checkbox.Label overflowWrap="anywhere" userSelect="unset">
            {name}
          </Checkbox.Label>
        </Checkbox.Root>
      ) : (
        <HStack gap={2.5} opacity={isDisabled ? 0.5 : undefined}>
          <InfoTooltip
            content="This addon does not change any of the data visible on this page"
            iconProps={{ color: 'border.emphasized' }}
          />

          <Span
            fontSize="sm"
            fontWeight="medium"
            lineHeight="1.25rem"
            overflowWrap="anywhere"
          >
            {name}
          </Span>
        </HStack>
      )}

      <Span
        color={isDisabled ? 'fg.muted' : undefined}
        fontSize="sm"
        lineHeight="1.25rem"
      >
        {addonCost(addon)}
      </Span>
    </Stack>
  );
}
