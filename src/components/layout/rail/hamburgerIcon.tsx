import { chakra } from '@chakra-ui/react';
import React from 'react';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';

const RECT_BASE: React.CSSProperties = {
  transformBox: 'fill-box',
  transformOrigin: 'center',
  transition: `transform ${DURATION_BASE} ${EASE}, opacity ${DURATION_BASE} ${EASE}`,
};

export default function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <chakra.svg
      aria-hidden
      fill="currentColor"
      focusable="false"
      height="20px"
      viewBox="0 0 20 20"
      width="20px"
    >
      <rect
        height="2"
        rx="1"
        style={{
          ...RECT_BASE,
          transform: open ? 'translateY(6px) rotate(45deg)' : undefined,
        }}
        width="18"
        x="1"
        y="3"
      />
      <rect
        height="2"
        rx="1"
        style={{
          ...RECT_BASE,
          opacity: open ? 0 : 1,
          transform: open ? 'scaleX(0)' : undefined,
        }}
        width="18"
        x="1"
        y="9"
      />
      <rect
        height="2"
        rx="1"
        style={{
          ...RECT_BASE,
          transform: open ? 'translateY(-6px) rotate(-45deg)' : undefined,
        }}
        width="18"
        x="1"
        y="15"
      />
    </chakra.svg>
  );
}
