import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface SearchStore {
  open: boolean;
  setOpen(open: boolean): void;
  toggle(): void;
}

export const useSearchStore = create(
  immer<SearchStore>((set) => ({
    open: false,
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
  })),
);

export function openSiteSearch() {
  useSearchStore.getState().setOpen(true);
}

export function closeSiteSearch() {
  useSearchStore.getState().setOpen(false);
}
