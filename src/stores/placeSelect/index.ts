import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface PlaceSelectStore {
  placeId?: number;
  setPlaceId: (placeId?: number) => void;
}

export const usePlaceSelectStore = create(
  persist(
    immer<PlaceSelectStore>((set) => ({
      placeId: undefined,
      setPlaceId: (placeId) => set({ placeId }),
    })),
    {
      name: 'place-select',
    },
  ),
);
