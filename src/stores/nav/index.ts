import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface NavStore {
  placeId?: number;
  setPlaceId: (placeId?: number) => void;

  tab?: string;
  setTab: (tab?: string) => void;
}

export const useNavStore = create(
  persist(
    immer<NavStore>((set) => ({
      placeId: undefined,
      setPlaceId: (placeId) => set({ placeId }),

      tab: undefined,
      setTab: (tab) => set({ tab }),
    })),
    {
      name: 'nav',
      version: 0,
    },
  ),
);
