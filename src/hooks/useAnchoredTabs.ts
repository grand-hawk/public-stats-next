import React from 'react';

const SETTLE_FRAMES = 8;

function findScrollContainer(element: HTMLElement | null) {
  let node = element?.parentElement ?? null;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
}

export function useAnchoredTabs<T extends HTMLElement>(value: string) {
  const ref = React.useRef<T>(null);
  const anchorTop = React.useRef<number | null>(null);

  const mark = React.useCallback(() => {
    anchorTop.current = ref.current?.getBoundingClientRect().top ?? null;
  }, []);

  React.useLayoutEffect(() => {
    if (anchorTop.current === null) return undefined;

    const target = anchorTop.current;
    const container = findScrollContainer(ref.current);
    let frame = 0;
    let handle = 0;

    const restore = () => {
      if (!ref.current || !container) return;
      const delta = ref.current.getBoundingClientRect().top - target;
      if (Math.abs(delta) < 1) return;
      container.style.scrollBehavior = 'auto';
      container.scrollTop += delta;
      container.style.scrollBehavior = '';
    };

    const observer = new MutationObserver(restore);
    if (container) {
      container.style.overflowAnchor = 'none';
      observer.observe(container, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    const settle = () => {
      restore();
      frame += 1;
      if (frame < SETTLE_FRAMES) {
        handle = requestAnimationFrame(settle);
        return;
      }
      observer.disconnect();
      if (container) container.style.overflowAnchor = '';
      anchorTop.current = null;
    };

    restore();
    handle = requestAnimationFrame(settle);

    return () => {
      cancelAnimationFrame(handle);
      observer.disconnect();
      if (container) container.style.overflowAnchor = '';
    };
  }, [value]);

  return { mark, ref };
}
