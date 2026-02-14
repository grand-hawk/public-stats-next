import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ArmorStore {
  tourSeen: boolean;
  setTourSeen(seen: boolean): void;
}

export const useArmorStore = create<ArmorStore>()(
  persist(
    immer((set) => ({
      tourSeen: false,

      setTourSeen(seen) {
        set((s) => {
          s.tourSeen = seen;
        });
      },
    })),
    {
      name: 'armor',
    },
  ),
);
