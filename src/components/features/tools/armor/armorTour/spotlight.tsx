import { Box } from '@chakra-ui/react';
import React from 'react';

import { PADDING } from '@/components/features/tools/armor/armorTour/position';

import type { TargetRect } from '@/components/features/tools/armor/armorTour/position';

const BACKDROP = 'var(--background-color-backdrop-light)';

export function TourSpotlight({ rect }: { rect: TargetRect | null }) {
  const style: React.CSSProperties = rect
    ? {
        position: 'fixed',
        top: rect.top - PADDING,
        left: rect.left - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
        borderRadius: 8,
        boxShadow: `0 0 0 1px var(--border-color-base), 0 0 0 9999px ${BACKDROP}`,
        zIndex: 10000,
        pointerEvents: 'none',
      }
    : {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: BACKDROP,
        zIndex: 10000,
        pointerEvents: 'none',
      };

  return <Box style={style} />;
}
