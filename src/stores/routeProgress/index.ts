import { create } from 'zustand';

export type RouteProgressPhase = 'idle' | 'loading' | 'finishing';

export interface RouteProgressStore {
  phase: RouteProgressPhase;
  holds: number;
  start(): void;
  done(): void;
  reset(): void;
  hold(): void;
  release(): void;
}

export const useRouteProgressStore = create<RouteProgressStore>((set, get) => ({
  phase: 'idle',
  holds: 0,
  start() {
    set({ phase: 'loading' });
  },
  done() {
    if (get().holds > 0) return;
    if (get().phase === 'loading') set({ phase: 'finishing' });
  },
  reset() {
    if (get().phase === 'finishing') set({ phase: 'idle' });
  },
  hold() {
    set({ holds: get().holds + 1, phase: 'loading' });
  },
  release() {
    set({ holds: Math.max(0, get().holds - 1) });
    get().done();
  },
}));

export function routeContentReady() {
  useRouteProgressStore.getState().done();
}
