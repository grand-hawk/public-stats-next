import React from 'react';

export function useScrollElement(ref: React.RefObject<HTMLElement | null>) {
  const [element, setElement] = React.useState<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    let node = ref.current?.parentElement ?? null;
    while (node) {
      const { overflowY } = getComputedStyle(node);
      if (overflowY === 'auto' || overflowY === 'scroll') break;
      node = node.parentElement;
    }
    setElement(node);
  }, [ref]);

  return element;
}
