import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface NavigationStore {
  placeId?: number;
  setPlaceId: (placeId?: number) => void;
}

export const useNavigationStore = create(
  persist(
    immer<NavigationStore>((set) => ({
      placeId: undefined,
      setPlaceId: (placeId) => set({ placeId }),
    })),
    {
      name: 'navigation',
    },
  ),
);
