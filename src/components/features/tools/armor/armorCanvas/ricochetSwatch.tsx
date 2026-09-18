import React from 'react';

import { fillRicochetStripes } from '@/components/features/tools/armor/armorCanvas/ricochetPattern';

const SWATCH_SIZE = 12;

export default function RicochetSwatch() {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.width = SWATCH_SIZE;
    element.height = SWATCH_SIZE;
    fillRicochetStripes(
      element.getContext('2d')!,
      0,
      0,
      SWATCH_SIZE,
      SWATCH_SIZE,
    );
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        width: `${SWATCH_SIZE}px`,
        height: `${SWATCH_SIZE}px`,
        imageRendering: 'pixelated',
        display: 'block',
        borderRadius: '2px',
      }}
    />
  );
}
