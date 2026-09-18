import { Box } from '@chakra-ui/react';
import React from 'react';

import { Band, BandInner } from '@/components/features/home/grid';
import HeroTabs from '@/components/features/home/heroTabs';
import {
  HERO_BORDER,
  HERO_OVERLAY,
  HERO_SURFACE,
  HERO_TEXT,
  HERO_TEXT_SUBTLE,
} from '@/components/features/home/palette';
import SiteSearchHero from '@/components/layout/search/siteSearchHero';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';

export default function HomeHero({
  initials,
  placeName,
}: {
  initials: string;
  placeName: string;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.muted = true;
    video.play().catch(() => undefined);
  }, []);

  return (
    <Band
      as="section"
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: '560px',
        paddingBlock: '64px',
        backgroundColor: HERO_SURFACE,
        color: HERO_TEXT,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: HERO_BORDER,
        [NARROW_MEDIA]: { minHeight: '480px', paddingBlock: '64px 32px' },
      }}
    >
      <Box
        css={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/assets/home/hero.jpg')",
          backgroundPosition: 'center 60%',
          backgroundSize: 'cover',
          '& video': {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 60%',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '& video': { display: 'none' },
          },
        }}
      >
        <video
          ref={videoRef}
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/home/hero.jpg"
          preload="metadata"
          src="/assets/home/hero.mp4"
          tabIndex={-1}
        />
      </Box>

      <Box
        css={{
          position: 'absolute',
          inset: 0,
          background: HERO_OVERLAY,
        }}
      />

      <BandInner
        css={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          '& .citizen-search-trigger': {
            marginInline: 0,
            marginTop: '32px',
            [NARROW_MEDIA]: { marginTop: '20px' },
          },
        }}
      >
        <Box
          as="h1"
          css={{
            maxWidth: '960px',
            margin: 0,
            fontSize: '3rem',
            fontWeight: 500,
            fontOpticalSizing: 'none',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            color: HERO_TEXT,
            textShadow: '0 2px 24px rgba(0, 0, 0, 0.55)',
            [NARROW_MEDIA]: { fontSize: '2rem' },
          }}
        >
          <span>Every {placeName} vehicle.</span>
          <Box
            as="span"
            css={{
              color: HERO_TEXT_SUBTLE,
              [NARROW_MEDIA]: { display: 'none' },
            }}
          >
            {' '}
            Armour, shells and K/D, measured.
          </Box>
        </Box>

        <SiteSearchHero />
        <HeroTabs initials={initials} />
      </BandInner>
    </Band>
  );
}
