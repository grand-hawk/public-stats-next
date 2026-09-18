import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import { ControlSection } from '@/components/features/tools/armor/controls/section';
import {
  QUIET_TEXT_BUTTON_CSS,
  ROW_CSS,
} from '@/components/features/tools/armor/controls/styles';
import { groupModules } from '@/components/features/tools/armor/moduleGroups';

import type { DamageModule } from '@/components/features/tools/armor/mtca';
import type { Palette } from '@/components/features/tools/armor/palettes';
import type { SystemStyleObject } from '@chakra-ui/react';

const MODULE_ROW_CSS: SystemStyleObject = {
  ...ROW_CSS,
  gap: '8px',
  width: '100%',
  height: '32px',
};

interface ModulesSectionProps {
  hiddenModules: ReadonlySet<number>;
  modules: DamageModule[];
  onToggleModule: (moduleIndices: number[]) => void;
  palette: Palette;
  usedModuleIndices: ReadonlySet<number>;
}

export function ModulesSection({
  hiddenModules,
  modules,
  onToggleModule,
  palette,
  usedModuleIndices,
}: ModulesSectionProps) {
  const allModulesHidden = Array.from(usedModuleIndices).every((i) =>
    hiddenModules.has(i),
  );

  return (
    <ControlSection
      label="Damage modules"
      action={
        <chakra.button
          css={QUIET_TEXT_BUTTON_CSS}
          type="button"
          onClick={() => onToggleModule(Array.from(usedModuleIndices))}
        >
          {allModulesHidden ? 'Show all' : 'Hide all'}
        </chakra.button>
      }
    >
      <Box>
        {groupModules(modules)
          .filter((group) =>
            group.indices.some((i) => usedModuleIndices.has(i)),
          )
          .map((group) => {
            const isHidden = group.indices.every((idx) =>
              hiddenModules.has(idx),
            );
            const mc = palette.moduleColor;

            return (
              <chakra.button
                key={group.label}
                aria-pressed={!isHidden}
                css={MODULE_ROW_CSS}
                type="button"
                onClick={() => onToggleModule(group.indices)}
              >
                <Box
                  flexShrink={0}
                  height="12px"
                  opacity={isHidden ? 0.25 : 1}
                  width="12px"
                  style={{ background: `rgb(${mc.r},${mc.g},${mc.b})` }}
                  css={{ borderRadius: '4px', transition: 'opacity 100ms' }}
                />
                <Box
                  as="span"
                  color={isHidden ? 'fg.subtle' : 'fg'}
                  minWidth={0}
                  overflow="hidden"
                  textDecoration={isHidden ? 'line-through' : 'none'}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {group.label}
                </Box>
              </chakra.button>
            );
          })}
      </Box>
    </ControlSection>
  );
}
