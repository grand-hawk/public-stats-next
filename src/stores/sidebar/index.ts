import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface SidebarStore {
  open: boolean;
  setOpen(open: boolean): void;
  isCollapsed: boolean;
  toggleCollapsed(): void;
  setCollapsed(collapsed: boolean): void;
}

export const useSidebarStore = create(
  immer<SidebarStore>((set) => ({
    open: false,
    setOpen(open) {
      set((s) => {
        s.open = open;
      });
    },
    isCollapsed: false,
    toggleCollapsed() {
      set((s) => {
        s.isCollapsed = !s.isCollapsed;
      });
    },
    setCollapsed(collapsed) {
      set((s) => {
        s.isCollapsed = collapsed;
      });
    },
  })),
);
