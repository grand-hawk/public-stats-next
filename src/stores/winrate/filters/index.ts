import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface FilterStore {
  loadout?: string;
  setLoadout: (loadout?: string) => void;

  map?: string;
  setMap: (map?: string) => void;
}

export const useFilterStore = create(
  persist(
    immer<FilterStore>((set) => ({
      loadout: undefined,
      setLoadout: (loadout) => set({ loadout }),

      map: undefined,
      setMap: (map) => set({ map }),
    })),
    {
      name: 'winrate-filters',
      version: 0,
    },
  ),
);
