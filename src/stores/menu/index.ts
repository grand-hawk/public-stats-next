import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface MenuStore {
  open: boolean;
  setOpen(open: boolean): void;
  toggle(): void;
  close(): void;
}

export const useMenuStore = create(
  immer<MenuStore>((set) => ({
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
    close() {
      set((s) => {
        s.open = false;
      });
    },
  })),
);
