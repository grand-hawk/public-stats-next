import { Box, Span, Stack } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import ShellInlineLink from '@/components/article/shellInlineLink';
import { EmptyState } from '@/components/ui/empty-state';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import StatArticleLink from '@/components/wiki/statArticleLink';
import { INFANTRY_WEAPONS_PATH, slotLabel } from '@/utils/infantryWeapons';

import type { TeamWeapon } from '@/server/api/trpc/routers/infantryWeapons';
import type { SystemStyleObject } from '@chakra-ui/react';

const CLASS_ORDER = ['Infantry', 'Crewman', 'Engineer'];

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

const BORDER_CSS: SystemStyleObject = {
  borderBlockStartWidth: '1px',
  borderBlockStartStyle: 'solid',
  borderInlineEndWidth: '1px',
  borderInlineEndStyle: 'solid',
};

function byName(a: TeamWeapon, b: TeamWeapon) {
  return a.name.localeCompare(b.name, undefined, { numeric: true });
}

export default function WeaponTierGrid({ weapons }: { weapons: TeamWeapon[] }) {
  const classes = CLASS_ORDER.filter((name) =>
    weapons.some((weapon) => weapon.class === name),
  );
  const tiers = [...new Set(weapons.map((weapon) => weapon.tier))].sort(
    (a, b) => a - b,
  );

  if (weapons.length === 0) {
    return (
      <Box css={FRAME_CSS}>
        <EmptyState icon={<GrDocumentMissing />} title="No weapons found" />
      </Box>
    );
  }

  return (
    <Box css={FRAME_CSS}>
      <Box
        display="grid"
        gridTemplateColumns={`auto repeat(${classes.length}, minmax(176px, 1fr))`}
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
          <Span css={LABEL_CSS}>
            <StatArticleLink article="tier">Tier</StatArticleLink>
          </Span>
        </Box>

        {classes.map((name, index) => (
          <Box
            key={name}
            css={{
              ...HEAD_CSS,
              borderInlineEndWidth: index === classes.length - 1 ? 0 : '1px',
              borderInlineEndStyle: 'solid',
              borderColor: 'var(--border-color-subtle)',
            }}
          >
            <Span css={LABEL_CSS}>{name}</Span>
          </Box>
        ))}

        {tiers.map((tier, tierIndex) => {
          const borderColor =
            tierIndex === 0
              ? 'var(--border-color-base)'
              : 'var(--border-color-subtle)';

          return (
            <React.Fragment key={tier}>
              <Box
                css={{
                  ...HEAD_CSS,
                  ...BORDER_CSS,
                  position: 'sticky',
                  insetInlineStart: 0,
                  zIndex: 1,
                  borderColor,
                }}
              >
                <Span css={LABEL_CSS}>{tier}</Span>
              </Box>

              {classes.map((name, classIndex) => (
                <Box
                  key={`${tier}-${name}`}
                  css={{
                    ...BORDER_CSS,
                    padding: '8px 12px',
                    borderInlineEndWidth:
                      classIndex === classes.length - 1 ? 0 : '1px',
                    borderColor,
                    fontSize: '0.875rem',
                    lineHeight: '1.375rem',
                  }}
                >
                  <Stack gap="4px">
                    {weapons
                      .filter(
                        (weapon) =>
                          weapon.tier === tier && weapon.class === name,
                      )
                      .sort(byName)
                      .map((weapon) => (
                        <Box key={`${weapon.slug}-${weapon.slot}`}>
                          <ShellInlineLink
                            basePath={INFANTRY_WEAPONS_PATH}
                            displayType={weapon.displayType ?? ''}
                            slug={weapon.slug}
                          >
                            {weapon.name}
                          </ShellInlineLink>{' '}
                          <Span color="fg.muted">{slotLabel(weapon.slot)}</Span>
                        </Box>
                      ))}
                  </Stack>
                </Box>
              ))}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
