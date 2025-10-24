import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SidebarStore {
  open: boolean;
  setOpen(open: boolean): void;
}

export const useSidebarStore = create(
  persist(
    immer<SidebarStore>((set) => ({
      open: false,
      setOpen(open) {
        set((s) => {
          s.open = open;
        });
      },
    })),
    {
      name: 'sidebar-storage',
      version: 1,
    },
  ),
);   },
  })),
);
