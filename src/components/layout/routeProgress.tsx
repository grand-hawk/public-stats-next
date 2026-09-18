import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { useRouteProgressStore } from '@/stores/routeProgress';

const FALLBACK_SELECTOR = '[data-route-fallback]';

export default function RouteProgress() {
  const router = useRouter();
  const phase = useRouteProgressStore((s) => s.phase);

  React.useEffect(() => {
    const { done, start } = useRouteProgressStore.getState();
    let settleTimer: number | undefined;

    const onStart = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return;
      if (url.split('?')[0] === window.location.pathname) return;
      window.clearTimeout(settleTimer);
      document.documentElement.dataset.navigating = 'true';
      start();
    };
    const onComplete = () => {
      delete document.documentElement.dataset.navigating;
      window.clearTimeout(settleTimer);
      const settle = (attempt: number) => {
        if (!document.querySelector(FALLBACK_SELECTOR) || attempt > 40) {
          done();
          return;
        }
        settleTimer = window.setTimeout(() => settle(attempt + 1), 250);
      };
      settleTimer = window.setTimeout(() => settle(0), 60);
    };
    const onError = () => {
      delete document.documentElement.dataset.navigating;
      window.clearTimeout(settleTimer);
      done();
    };

    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onComplete);
    router.events.on('routeChangeError', onError);
    return () => {
      window.clearTimeout(settleTimer);
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onComplete);
      router.events.off('routeChangeError', onError);
    };
  }, [router.events]);

  React.useEffect(() => {
    if (phase !== 'finishing') return;
    const id = window.setTimeout(
      () => useRouteProgressStore.getState().reset(),
      450,
    );
    return () => window.clearTimeout(id);
  }, [phase]);

  return (
    <Box
      aria-hidden
      css={{
        position: 'fixed',
        insetInline: 0,
        top: 0,
        height: '2px',
        zIndex: 600,
        pointerEvents: 'none',
        opacity: phase === 'loading' ? 1 : 0,
        transition: phase === 'finishing' ? 'opacity 250ms ease 180ms' : 'none',
      }}
    >
      <Box
        css={{
          height: '100%',
          transformOrigin: 'left center',
          backgroundColor: 'var(--color-progressive)',
          boxShadow: '0 0 8px var(--color-progressive)',
          transform:
            phase === 'idle'
              ? 'scaleX(0)'
              : phase === 'loading'
                ? 'scaleX(0.85)'
                : 'scaleX(1)',
          transition:
            phase === 'loading'
              ? 'transform 6s cubic-bezier(0.1, 0.7, 0.1, 1) 80ms'
              : phase === 'finishing'
                ? 'transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                : 'none',
        }}
      />
    </Box>
  );
}
