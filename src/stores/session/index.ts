import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware/persist';

export interface SessionStore {
  placeId?: number;
  setPlaceId: (placeId: number) => void;
}

export const useSessionStore = create(
  persist(
    immer<SessionStore>((set) => ({
      placeId: undefined,
      setPlaceId: (placeId) => set({ placeId }),
    })),
    {
      name: 'session',
    },
  ),
);
