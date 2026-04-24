import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface SearchStore {
  open: boolean;
  heroFocus: (() => void) | null;
  setOpen(open: boolean): void;
  toggle(): void;
  setHeroFocus(fn: (() => void) | null): void;
}

export const useSearchStore = create(
  immer<SearchStore>((set) => ({
    open: false,
    heroFocus: null,
    setOpen(open) {
      set((s) => {
        s.open = open;
      });
    },
    toggle() {
      set((s) => {
        s.open = !s.open;
      });
    },
    setHeroFocus(fn) {
      set((s) => {
        s.heroFocus = fn;
      });
    },
  })),
);
