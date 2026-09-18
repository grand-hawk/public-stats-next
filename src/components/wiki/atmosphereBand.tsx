import { Box } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

const MASK =
  'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.35) 55%, transparent)';

const ACCENT_GLOW =
  'radial-gradient(60% 100% at 30% 0%,' +
  ' color-mix(in oklch, var(--color-progressive) 14%, transparent), transparent 70%)';

function teamGlow(color: string) {
  const lifted = `oklch(from ${color} max(l, 0.55) c h)`;
  return (
    `radial-gradient(70% 100% at 25% 0%, color-mix(in oklch, ${lifted} 44%, transparent), transparent 72%),` +
    ` linear-gradient(to bottom, color-mix(in oklch, ${lifted} 14%, transparent), transparent 80%)`
  );
}

export default function AtmosphereBand({
  color,
  image,
}: {
  color?: string;
  image?: string;
}) {
  const showImage = !!image && !color;

  return (
    <Box
      aria-hidden
      css={{
        position: 'absolute',
        insetBlockStart: 0,
        insetInline: 0,
        height: '320px',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        background: color ? teamGlow(color) : image ? undefined : ACCENT_GLOW,
        maskImage: MASK,
        WebkitMaskImage: MASK,
        '@media (prefers-reduced-transparency: reduce)': { opacity: 0.5 },
      }}
    >
      {showImage && (
        <NextImage
          alt=""
          fill
          sizes="100vw"
          src={image}
          style={{
            objectFit: 'cover',
            filter: 'blur(40px) saturate(1.2)',
            opacity: 0.35,
            transform: 'scale(1.2)',
          }}
        />
      )}
    </Box>
  );
}
