import React from 'react';

import { groupModules } from '@/components/features/tools/armor/moduleGroups';

import type { DamageModule } from '@/components/features/tools/armor/mtca';

export function useHiddenModules(resetKey: string | null) {
  const [hiddenModules, setHiddenModules] = React.useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const prevModuleNamesRef = React.useRef('');

  const reset = React.useCallback(() => {
    setHiddenModules(new Set());
    prevModuleNamesRef.current = '';
  }, []);

  React.useEffect(() => {
    reset();
  }, [reset, resetKey]);

  const toggle = React.useCallback((moduleIndices: number[]) => {
    setHiddenModules((prev) => {
      const next = new Set(prev);
      const allHidden = moduleIndices.every((i) => next.has(i));
      for (const i of moduleIndices) {
        if (allHidden) next.delete(i);
        else next.add(i);
      }
      return next;
    });
  }, []);

  const applyDefaults = React.useCallback((modules: DamageModule[]) => {
    if (!modules.length) return;

    const key = modules.map((m) => m.name).join('\0');
    if (key === prevModuleNamesRef.current) return;
    prevModuleNamesRef.current = key;

    const hidden = new Set<number>();
    for (const group of groupModules(modules)) {
      if (group.initiallyHidden) {
        for (const idx of group.indices) hidden.add(idx);
      }
    }
    setHiddenModules(hidden);
  }, []);

  return { applyDefaults, hiddenModules, reset, toggle };
}
