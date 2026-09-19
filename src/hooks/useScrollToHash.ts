import { useRouter } from 'next/router';
import React from 'react';

const MAX_FRAMES = 180;

export function useScrollToHash(contentKey: string | undefined): void {
  const { asPath } = useRouter();

  React.useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !contentKey) return;

    let frame = 0;
    let frames = 0;

    const attempt = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
        return;
      }

      frames += 1;
      if (frames < MAX_FRAMES) frame = requestAnimationFrame(attempt);
    };

    attempt();
    return () => cancelAnimationFrame(frame);
  }, [asPath, contentKey]);
}
