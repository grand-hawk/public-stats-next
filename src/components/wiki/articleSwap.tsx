import { Box } from '@chakra-ui/react';
import React from 'react';

import { FOOTER_PUSH_MIN_HEIGHT } from '@/components/layout/shell/constants';
import { useRouteProgressStore } from '@/stores/routeProgress';

export default function ArticleSwap({
  children,
  id,
  stale,
}: {
  children: React.ReactNode;
  id: string;
  stale: boolean;
}) {
  const previousId = React.useRef(id);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!stale) return;
    const { hold, release } = useRouteProgressStore.getState();
    hold();
    return release;
  }, [stale]);

  React.useEffect(() => {
    if (previousId.current === id) return;
    previousId.current = id;
    let scroller = rootRef.current?.parentElement ?? null;
    while (scroller) {
      const overflowY = getComputedStyle(scroller).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') break;
      scroller = scroller.parentElement;
    }
    if (!scroller) return;
    scroller.style.scrollBehavior = 'auto';
    scroller.scrollTop = 0;
    scroller.style.scrollBehavior = '';
  }, [id]);

  return (
    <Box
      key={id}
      ref={rootRef}
      css={{
        minHeight: FOOTER_PUSH_MIN_HEIGHT,
        opacity: stale ? 0.5 : 1,
        animation:
          'citizen-fade-in 260ms cubic-bezier(0.05, 0.7, 0.1, 1) backwards',
        transition: 'opacity 150ms cubic-bezier(0.2, 0, 0, 1) 100ms',
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          transition: 'none',
        },
      }}
    >
      {children}
    </Box>
  );
}
