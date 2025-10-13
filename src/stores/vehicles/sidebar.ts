import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface VehicleSidebarStore {
  open: boolean;
  setOpen(open: boolean): void;
}

export const useVehicleSidebarStore = create(
  immer<VehicleSidebarStore>((set) => ({
    open: false,
    setOpen(open) {
      set((s) => {
        s.open = open;
      });
    },
  })),
);
