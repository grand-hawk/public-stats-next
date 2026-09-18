import { Box, Span, Stack } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import { organizeVehicles } from '@/components/features/teams/loadouts/organizeVehicles';
import VehicleCell from '@/components/features/teams/loadouts/vehicleCell';
import { EmptyState } from '@/components/ui/empty-state';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';

import type { GridVehicle } from '@/components/features/teams/loadouts/organizeVehicles';
import type { SystemStyleObject } from '@chakra-ui/react';

const FRAME_CSS: SystemStyleObject = {
  ...RAISED_FRAME_CSS,
  overflow: 'auto hidden',
  width: '100%',
};

const LABEL_CSS: SystemStyleObject = {
  color: 'fg.emphasized',
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '1.375rem',
};

const HEAD_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--color-surface-2)',
  padding: '8px 12px',
};

export default React.memo(function LoadoutVehiclesGrid({
  initials,
  vehicles,
}: {
  initials: string;
  vehicles: Record<string, GridVehicle>;
}) {
  const vehicleEntries = React.useMemo(
    () => Object.entries(vehicles),
    [vehicles],
  );

  const { byTierAndClassification, classifications, tiers } = React.useMemo(
    () => organizeVehicles(vehicleEntries),
    [vehicleEntries],
  );

  if (vehicleEntries.length === 0) {
    return (
      <Box css={FRAME_CSS}>
        <EmptyState
          icon={<GrDocumentMissing />}
          title="No vehicles found for this loadout"
        />
      </Box>
    );
  }

  return (
    <Box css={FRAME_CSS}>
      <Box
        display="grid"
        gridTemplateColumns={`auto repeat(${classifications.length}, minmax(152px, 1fr))`}
        minWidth="fit-content"
      >
        <Box
          css={{
            ...HEAD_CSS,
            position: 'sticky',
            insetInlineStart: 0,
            zIndex: 2,
            borderInlineEndWidth: '1px',
            borderInlineEndStyle: 'solid',
            borderColor: 'var(--border-color-subtle)',
          }}
        >
          <Span css={LABEL_CSS}>Tier</Span>
        </Box>

        {classifications.map((classification, index) => (
          <Box
            key={classification}
            css={{
              ...HEAD_CSS,
              borderInlineEndWidth:
                index === classifications.length - 1 ? 0 : '1px',
              borderInlineEndStyle: 'solid',
              borderColor: 'var(--border-color-subtle)',
            }}
          >
            <Span css={LABEL_CSS}>{classification}</Span>
          </Box>
        ))}

        {tiers.map((tier, tierIndex) => {
          const rowBorderColor =
            tierIndex === 0
              ? 'var(--border-color-base)'
              : 'var(--border-color-subtle)';

          return (
            <React.Fragment key={tier}>
              <Box
                css={{
                  ...HEAD_CSS,
                  position: 'sticky',
                  insetInlineStart: 0,
                  zIndex: 1,
                  borderBlockStartWidth: '1px',
                  borderBlockStartStyle: 'solid',
                  borderInlineEndWidth: '1px',
                  borderInlineEndStyle: 'solid',
                  borderColor: rowBorderColor,
                }}
              >
                <Span css={LABEL_CSS}>{tier}</Span>
              </Box>

              {classifications.map((classification, classIndex) => (
                <Box
                  key={`${tier}-${classification}`}
                  css={{
                    padding: '8px',
                    borderBlockStartWidth: '1px',
                    borderBlockStartStyle: 'solid',
                    borderInlineEndWidth:
                      classIndex === classifications.length - 1 ? 0 : '1px',
                    borderInlineEndStyle: 'solid',
                    borderColor: rowBorderColor,
                  }}
                >
                  <Stack gap="8px">
                    {byTierAndClassification[tier][classification].map(
                      (item) => (
                        <VehicleCell
                          key={item.slug}
                          initials={initials}
                          name={item.name}
                          slug={item.slug}
                          premium={
                            item.vehicle.premiumType ??
                            item.vehicle.premium?.type
                          }
                        />
                      ),
                    )}
                  </Stack>
                </Box>
              ))}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
});
