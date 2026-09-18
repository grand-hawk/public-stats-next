import React from 'react';

export interface ToggleSet<T extends string> {
  clear: () => void;
  selected: Set<T>;
  toggle: (key: T) => void;
}

export function useToggleSet<T extends string>(
  initial?: Iterable<T>,
): ToggleSet<T> {
  const [selected, setSelected] = React.useState<Set<T>>(
    () => new Set(initial),
  );

  return {
    clear: () => setSelected(new Set()),
    selected,
    toggle: (key) =>
      setSelected((previous) => {
        const next = new Set(previous);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      }),
  };
}
