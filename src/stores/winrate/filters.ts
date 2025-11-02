import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface WinrateFiltersStore {
  loadout: string | null;
  setLoadout(loadout: string | null): void;

  map: string | null;
  setMap(map: string | null): void;
}

export const useWinrateFiltersStore = create(
  immer<WinrateFiltersStore>((set) => ({
    loadout: null,
    setLoadout(loadout) {
      set((s) => {
        s.loadout = loadout;
      });
    },

    map: null,
    setMap(map) {
      set((s) => {
        s.map = map;
      });
    },
  })),
);
